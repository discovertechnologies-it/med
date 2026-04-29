import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Upload,
  Camera,
  X,
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Trash2,
  Plus,
  ArrowRight,
} from 'lucide-react';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import { usePrescriptionStore } from '@/store/usePrescriptionStore';
import { uploadPrescription, validateFile } from '@/api/prescriptionApi';
import { staggerContainer, fadeUp } from '@/motion/variants';
import { springs } from '@/motion/transitions';

const statusMap = {
  under_review: { variant: 'warning', icon: <Clock size={12} />, label: 'Under review' },
  approved: { variant: 'success', icon: <ShieldCheck size={12} />, label: 'Approved' },
  rejected: { variant: 'danger', icon: <AlertTriangle size={12} />, label: 'Rejected' },
  clarification: { variant: 'warning', icon: <AlertTriangle size={12} />, label: 'Needs clarification' },
};

export default function Prescriptions() {
  const prescriptions = usePrescriptionStore((s) => s.prescriptions);
  const remove = usePrescriptionStore((s) => s.remove);
  const add = usePrescriptionStore((s) => s.add);

  return (
    <main className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 py-6 md:py-10">
      <h1 className="text-h1 md:text-h1-lg text-text-primary">Prescriptions</h1>
      <p className="mt-1 text-body text-text-secondary">
        Upload once and reuse for refills. Reviewed by a licensed pharmacist.
      </p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        <div className="lg:col-span-7 xl:col-span-8 order-2 lg:order-1">
          {prescriptions.length === 0 ? (
            <EmptyState />
          ) : (
            <m.ul
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-3"
            >
              <AnimatePresence initial={false}>
                {prescriptions.map((rx) => (
                  <m.li
                    key={rx.id}
                    layout
                    variants={fadeUp}
                    exit={{ opacity: 0, x: -16, transition: { duration: 0.2 } }}
                  >
                    <PrescriptionCard
                      rx={rx}
                      onRemove={() => {
                        remove(rx.id);
                        toast(`Prescription removed`, {
                          action: {
                            label: 'Undo',
                            onClick: () => add(rx),
                          },
                        });
                      }}
                    />
                  </m.li>
                ))}
              </AnimatePresence>
            </m.ul>
          )}
        </div>

        <aside className="lg:col-span-5 xl:col-span-4 order-1 lg:order-2">
          <UploadCard />
        </aside>
      </div>
    </main>
  );
}

function PrescriptionCard({ rx, onRemove }) {
  const status = statusMap[rx.status] ?? statusMap.under_review;
  return (
    <article className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-4 md:p-5">
      <div className="flex items-start gap-3">
        <PreviewStrip files={rx.files} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-body font-semibold text-text-primary line-clamp-1">
                {rx.doctor ? `Dr. ${rx.doctor}` : 'Prescription'}
                {rx.clinic ? `, ${rx.clinic}` : ''}
              </p>
              <p className="text-caption text-text-tertiary">
                Uploaded {format(new Date(rx.uploadedAt), 'd MMM yyyy, h:mm a')}
                {rx.issueDate ? ` · Issued ${format(new Date(rx.issueDate), 'd MMM yyyy')}` : ''}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant={status.variant} icon={status.icon}>
                  {status.label}
                </Badge>
                <span className="text-caption text-text-tertiary">
                  {rx.files.length} {rx.files.length === 1 ? 'file' : 'files'} &middot;{' '}
                  Patient {rx.patientName}
                </span>
              </div>
              {rx.status === 'rejected' && rx.rejectionReason && (
                <p className="mt-2 text-caption text-danger">{rx.rejectionReason}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onRemove}
              aria-label="Remove prescription"
              className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary hover:bg-danger-muted hover:text-danger transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function PreviewStrip({ files }) {
  const first = files[0];
  return (
    <div className="shrink-0 relative h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden bg-bg-image border border-border-subtle">
      {first?.type?.startsWith('image/') ? (
        <img src={first.dataUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center text-text-tertiary">
          <FileText size={20} />
          <span className="text-caption mt-1">PDF</span>
        </div>
      )}
      {files.length > 1 && (
        <span className="absolute bottom-1 right-1 inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-text-primary text-bg-page text-[10px] font-bold">
          +{files.length - 1}
        </span>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-8 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-muted text-primary">
        <FileText size={22} />
      </span>
      <h2 className="mt-4 text-h3 text-text-primary">No prescriptions yet</h2>
      <p className="mt-2 text-body text-text-secondary max-w-sm mx-auto">
        Upload your prescription to attach it to orders for prescription medicines.
      </p>
    </div>
  );
}

function UploadCard() {
  const add = usePrescriptionStore((s) => s.add);
  const inputRef = useRef(null);
  const cameraRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [doctor, setDoctor] = useState('');
  const [clinic, setClinic] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [patientName, setPatientName] = useState('Self');
  const [submitting, setSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (incoming) => {
    const arr = Array.from(incoming || []);
    if (!arr.length) return;
    if (files.length + arr.length > 5) {
      toast.error('Up to 5 files per prescription');
      return;
    }
    const valid = [];
    for (const f of arr) {
      const err = validateFile(f);
      if (err) {
        toast.error(`${f.name}: ${err}`);
        continue;
      }
      valid.push(f);
    }
    setFiles((cur) => [...cur, ...valid]);
  };

  const removeFile = (i) => setFiles((cur) => cur.filter((_, idx) => idx !== i));

  const reset = () => {
    setFiles([]);
    setDoctor('');
    setClinic('');
    setIssueDate('');
    setPatientName('Self');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) {
      toast.error('Add at least one image or PDF');
      return;
    }
    setSubmitting(true);
    await toast.promise(
      uploadPrescription({ files, doctor, clinic, issueDate, patientName }).then((rx) => {
        add(rx);
        reset();
        return rx;
      }),
      {
        loading: 'Uploading prescription',
        success: 'Prescription uploaded — under review',
        error: (e) => e.message || 'Upload failed',
      }
    );
    setSubmitting(false);
  };

  const previews = files.map((f, i) => ({ file: f, key: `${f.name}-${i}` }));

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-5 md:p-6 lg:sticky lg:top-20">
      <h2 className="text-h3 text-text-primary">Upload new</h2>
      <p className="mt-1 text-caption text-text-secondary">
        JPG, PNG, or PDF. Up to 5 files, 10 MB each.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* Drop zone */}
        <div
          onDragEnter={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragActive(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary-muted'
              : 'border-border-subtle hover:border-border-strong'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = '';
            }}
          />
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = '';
            }}
          />
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-muted text-primary">
            <Upload size={20} />
          </span>
          <p className="mt-3 text-body font-semibold text-text-primary">
            Drop files here or
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              leftIcon={<ImageIcon size={16} />}
              onClick={() => inputRef.current?.click()}
            >
              Choose files
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              leftIcon={<Camera size={16} />}
              onClick={() => cameraRef.current?.click()}
              className="md:hidden"
            >
              Camera
            </Button>
          </div>
        </div>

        {/* Previews */}
        {previews.length > 0 && (
          <m.ul
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-3 gap-2"
          >
            <AnimatePresence initial={false}>
              {previews.map(({ file, key }, i) => (
                <m.li
                  key={key}
                  layout
                  variants={fadeUp}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative aspect-square rounded-xl overflow-hidden bg-bg-image border border-border-subtle"
                >
                  {file.type === 'application/pdf' ? (
                    <div className="h-full w-full flex flex-col items-center justify-center text-text-tertiary">
                      <FileText size={20} />
                      <span className="text-caption mt-1 line-clamp-1 px-1">{file.name}</span>
                    </div>
                  ) : (
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="h-full w-full object-cover"
                      onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    aria-label="Remove file"
                    className="absolute top-1 right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-bg-surface/95 text-text-primary shadow-card hover:bg-danger hover:text-white transition-colors"
                  >
                    <X size={12} />
                  </button>
                </m.li>
              ))}
              {previews.length < 5 && (
                <m.li
                  key="addmore"
                  variants={fadeUp}
                  layout
                  className="aspect-square"
                >
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="h-full w-full rounded-xl border-2 border-dashed border-border-subtle hover:border-primary text-text-tertiary hover:text-primary flex items-center justify-center transition-colors"
                    aria-label="Add more"
                  >
                    <Plus size={20} />
                  </button>
                </m.li>
              )}
            </AnimatePresence>
          </m.ul>
        )}

        {/* Optional metadata */}
        <details className="group">
          <summary className="cursor-pointer text-caption font-semibold text-primary hover:text-primary-hover select-none list-none flex items-center gap-1">
            Add details (optional)
            <span className="transition-transform group-open:rotate-90">
              <ArrowRight size={12} />
            </span>
          </summary>
          <div className="mt-3 space-y-3">
            <Field
              id="doctor"
              label="Doctor name"
              value={doctor}
              onChange={setDoctor}
              placeholder="Dr. Mehta"
            />
            <Field id="clinic" label="Clinic" value={clinic} onChange={setClinic} placeholder="Apollo, Indiranagar" />
            <div className="grid grid-cols-2 gap-3">
              <Field
                id="issueDate"
                label="Issued on"
                type="date"
                value={issueDate}
                onChange={setIssueDate}
              />
              <Field
                id="patient"
                label="Patient name"
                value={patientName}
                onChange={setPatientName}
              />
            </div>
          </div>
        </details>

        <Button
          type="submit"
          fullWidth
          loading={submitting}
          disabled={submitting || files.length === 0}
          rightIcon={!submitting && <ArrowRight size={18} />}
        >
          {submitting ? 'Uploading' : 'Submit prescription'}
        </Button>

        <p className="text-caption text-text-tertiary text-center">
          Your prescription is encrypted and reviewed only by licensed pharmacists.
        </p>

        <p className="text-caption text-text-tertiary text-center">
          Need to attach to an order?{' '}
          <Link to="/cart" className="text-primary hover:underline font-semibold">
            Go to cart
          </Link>
        </p>
      </form>
    </div>
  );
}

function Field({ id, label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label htmlFor={id} className="block text-label uppercase text-text-tertiary mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full h-11 px-4 rounded-full bg-bg-page border border-border-subtle hover:border-border-strong focus:border-primary text-text-primary placeholder:text-text-tertiary outline-none transition-colors"
      />
    </div>
  );
}

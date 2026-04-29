import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { m, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Save, Phone, Plus, Trash2, Users, X } from 'lucide-react';
import clsx from 'clsx';
import * as yup from 'yup';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import { useProfileStore } from '@/store/useProfileStore';
import { useAuthStore } from '@/store/useAuthStore';
import { profileSchema } from '@/validators/profileSchema';
import { fadeUp, staggerContainer } from '@/motion/variants';
import { springs } from '@/motion/transitions';

const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'no_answer', label: 'Prefer not to say' },
];

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function Profile() {
  const profile = useProfileStore();
  const update = useProfileStore((s) => s.update);
  const user = useAuthStore((s) => s.user);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: profile.name || '',
      dob: profile.dob || '',
      gender: profile.gender || null,
      bloodGroup: profile.bloodGroup || '',
    },
  });

  const gender = watch('gender');
  const bloodGroup = watch('bloodGroup');

  const onSubmit = async (data) => {
    update({
      name: data.name.trim(),
      dob: data.dob || null,
      gender: data.gender || null,
      bloodGroup: data.bloodGroup || null,
    });
    toast.success('Profile saved');
    reset(data);
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Personal details" subtitle="Used for orders and prescriptions.">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <Field
            id="name"
            label="Full name"
            placeholder="Vaibhav Kumar"
            error={errors.name?.message}
            register={register('name')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              id="dob"
              type="date"
              label="Date of birth"
              error={errors.dob?.message}
              register={register('dob')}
            />
            <div>
              <label className="block text-label uppercase text-text-tertiary mb-1.5">
                Blood group
              </label>
              <div className="flex flex-wrap gap-1.5">
                {bloodGroups.map((g) => {
                  const active = bloodGroup === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setValue('bloodGroup', active ? '' : g, { shouldDirty: true })}
                      className={clsx(
                        'px-3 h-9 rounded-full text-caption font-semibold tabular border transition-colors',
                        active
                          ? 'bg-primary text-white border-primary'
                          : 'bg-bg-surface text-text-secondary border-border-subtle hover:border-border-strong hover:text-text-primary'
                      )}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-label uppercase text-text-tertiary mb-1.5">Gender</label>
            <div className="flex flex-wrap gap-2">
              {genders.map((g) => {
                const active = gender === g.value;
                return (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() =>
                      setValue('gender', active ? null : g.value, { shouldDirty: true })
                    }
                    className={clsx(
                      'px-4 h-10 rounded-full text-caption font-semibold border transition-colors',
                      active
                        ? 'bg-primary text-white border-primary'
                        : 'bg-bg-surface text-text-secondary border-border-subtle hover:border-border-strong hover:text-text-primary'
                    )}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <p className="text-caption text-text-tertiary inline-flex items-center gap-1.5">
              <Phone size={14} />
              Signed in as <span className="text-text-primary font-semibold">+91 {user?.mobile}</span>
            </p>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!isDirty || isSubmitting}
              leftIcon={!isSubmitting && <Save size={18} />}
            >
              {isSubmitting ? 'Saving' : 'Save changes'}
            </Button>
          </div>
        </form>
      </SectionCard>

      <FamilyMembersSection />
    </div>
  );
}

function SectionCard({ title, subtitle, children, action }) {
  return (
    <section className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-5 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-h2 text-text-primary">{title}</h2>
          {subtitle && <p className="text-caption text-text-secondary mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

const familySchema = yup.object({
  name: yup.string().trim().required('Name is required').max(60),
  age: yup
    .number()
    .typeError('Age must be a number')
    .integer()
    .min(0, 'Invalid age')
    .max(120, 'Invalid age')
    .required('Age is required'),
  relation: yup.string().required('Relation is required'),
  gender: yup.string().nullable(),
});

const relations = ['Spouse', 'Child', 'Parent', 'Sibling', 'Other'];
const familyGenders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];
const MAX_FAMILY = 5;

function FamilyMembersSection() {
  const family = useProfileStore((s) => s.family);
  const addFamily = useProfileStore((s) => s.addFamily);
  const removeFamily = useProfileStore((s) => s.removeFamily);
  const [adding, setAdding] = useState(false);

  const limitReached = family.length >= MAX_FAMILY;

  return (
    <SectionCard
      title="Family members"
      subtitle={`Tag orders to a dependent. Up to ${MAX_FAMILY} members.`}
      action={
        !adding && !limitReached ? (
          <Button size="sm" leftIcon={<Plus size={16} />} onClick={() => setAdding(true)}>
            Add member
          </Button>
        ) : null
      }
    >
      <AnimatePresence initial={false}>
        {adding && (
          <m.div
            key="form"
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={springs.snappy}
            className="mb-4"
          >
            <FamilyForm
              onCancel={() => setAdding(false)}
              onSubmit={(data) => {
                addFamily(data);
                toast.success(`${data.name} added`);
                setAdding(false);
              }}
            />
          </m.div>
        )}
      </AnimatePresence>

      {family.length === 0 ? (
        <EmptyFamily onAdd={() => setAdding(true)} disabled={limitReached} />
      ) : (
        <m.ul
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          <AnimatePresence initial={false}>
            {family.map((m1) => (
              <m.li
                key={m1.id}
                layout
                variants={fadeUp}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
              >
                <FamilyCard
                  member={m1}
                  onRemove={() => {
                    removeFamily(m1.id);
                    toast(`${m1.name} removed`, {
                      action: {
                        label: 'Undo',
                        onClick: () => addFamily(m1),
                      },
                    });
                  }}
                />
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>
      )}

      {limitReached && family.length > 0 && (
        <p className="mt-3 text-caption text-text-tertiary text-center">
          You have reached the {MAX_FAMILY} member limit. Remove one to add another.
        </p>
      )}
    </SectionCard>
  );
}

function FamilyCard({ member, onRemove }) {
  const initial = member.name.charAt(0).toUpperCase();
  return (
    <article className="bg-bg-page border border-border-subtle rounded-xl p-4 flex items-center gap-3">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-muted text-primary font-bold text-body shrink-0">
        {initial}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-body font-semibold text-text-primary line-clamp-1">{member.name}</p>
          <Badge variant="neutral">{member.relation}</Badge>
        </div>
        <p className="text-caption text-text-tertiary tabular">
          {member.age} {member.age === 1 ? 'year' : 'years'}
          {member.gender ? ` · ${member.gender}` : ''}
        </p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${member.name}`}
        className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary hover:bg-danger-muted hover:text-danger transition-colors"
      >
        <Trash2 size={14} />
      </button>
    </article>
  );
}

function EmptyFamily({ onAdd, disabled }) {
  return (
    <div className="bg-bg-page border border-dashed border-border-subtle rounded-xl p-6 text-center">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-muted text-primary">
        <Users size={20} />
      </span>
      <p className="mt-3 text-body font-semibold text-text-primary">No family members yet</p>
      <p className="mt-1 text-caption text-text-secondary max-w-sm mx-auto">
        Add a dependent so refill reminders and orders can be tagged to them.
      </p>
      {!disabled && (
        <div className="mt-4 inline-block">
          <Button size="sm" leftIcon={<Plus size={16} />} onClick={onAdd}>
            Add member
          </Button>
        </div>
      )}
    </div>
  );
}

function FamilyForm({ onCancel, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(familySchema),
    defaultValues: { name: '', age: '', relation: 'Child', gender: null },
  });
  const relation = watch('relation');
  const gender = watch('gender');

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit({ ...data, age: Number(data.age) }))}
      noValidate
      className="bg-bg-page border border-border-subtle rounded-xl p-4 md:p-5"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="text-h3 text-text-primary">Add family member</h3>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary hover:bg-bg-muted hover:text-text-primary transition"
        >
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FamilyField
          id="fam-name"
          label="Name"
          register={register('name')}
          error={errors.name?.message}
          className="sm:col-span-2"
        />
        <FamilyField
          id="fam-age"
          label="Age"
          type="number"
          inputMode="numeric"
          min="0"
          max="120"
          register={register('age')}
          error={errors.age?.message}
        />
        <div>
          <label className="block text-label uppercase text-text-tertiary mb-1.5">Relation</label>
          <div className="flex flex-wrap gap-1.5">
            {relations.map((r) => {
              const active = relation === r;
              return (
                <button
                  type="button"
                  key={r}
                  onClick={() => setValue('relation', r, { shouldDirty: true })}
                  className={clsx(
                    'px-3 h-8 rounded-full text-caption font-semibold border transition-colors',
                    active
                      ? 'bg-primary text-white border-primary'
                      : 'bg-bg-surface text-text-secondary border-border-subtle hover:border-border-strong hover:text-text-primary'
                  )}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-label uppercase text-text-tertiary mb-1.5">
            Gender (optional)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {familyGenders.map((g) => {
              const active = gender === g.value;
              return (
                <button
                  type="button"
                  key={g.value}
                  onClick={() =>
                    setValue('gender', active ? null : g.value, { shouldDirty: true })
                  }
                  className={clsx(
                    'px-3 h-8 rounded-full text-caption font-semibold border transition-colors',
                    active
                      ? 'bg-primary text-white border-primary'
                      : 'bg-bg-surface text-text-secondary border-border-subtle hover:border-border-strong hover:text-text-primary'
                  )}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" loading={isSubmitting} leftIcon={!isSubmitting && <Plus size={14} />}>
          {isSubmitting ? 'Adding' : 'Add'}
        </Button>
      </div>
    </form>
  );
}

function FamilyField({ id, label, error, register, className = '', ...rest }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-label uppercase text-text-tertiary mb-1.5">
        {label}
      </label>
      <input
        id={id}
        autoComplete="off"
        aria-invalid={Boolean(error)}
        className={clsx(
          'w-full h-10 px-4 rounded-full bg-bg-surface border outline-none transition-colors text-text-primary placeholder:text-text-tertiary',
          error
            ? 'border-danger'
            : 'border-border-subtle hover:border-border-strong focus:border-primary'
        )}
        {...rest}
        {...register}
      />
      {error && <p className="mt-1 text-caption text-danger">{error}</p>}
    </div>
  );
}

function Field({ id, label, error, register, ...rest }) {
  return (
    <div>
      <label htmlFor={id} className="block text-label uppercase text-text-tertiary mb-1.5">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={clsx(
          'w-full h-11 px-4 rounded-full bg-bg-page border outline-none transition-colors text-text-primary placeholder:text-text-tertiary',
          error
            ? 'border-danger'
            : 'border-border-subtle hover:border-border-strong focus:border-primary'
        )}
        {...rest}
        {...register}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-caption text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

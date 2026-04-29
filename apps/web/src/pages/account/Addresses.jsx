import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { m, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Star, Save, X, MapPin } from 'lucide-react';
import clsx from 'clsx';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import { useAddressStore } from '@/store/useAddressStore';
import { addressSchema } from '@/validators/profileSchema';
import { springs } from '@/motion/transitions';
import { fadeUp, staggerContainer } from '@/motion/variants';

const empty = {
  label: 'Home',
  name: '',
  phone: '',
  line1: '',
  line2: '',
  landmark: '',
  city: '',
  state: '',
  pincode: '',
  isDefault: false,
};

export default function Addresses() {
  const addresses = useAddressStore((s) => s.addresses);
  const add = useAddressStore((s) => s.add);
  const update = useAddressStore((s) => s.update);
  const remove = useAddressStore((s) => s.remove);
  const setDefault = useAddressStore((s) => s.setDefault);

  const [editing, setEditing] = useState(null); // null | 'new' | id
  const [params, setParams] = useSearchParams();

  // Auto-open form when arriving via /account/addresses?new=1
  useEffect(() => {
    if (params.get('new') === '1' && editing === null) {
      setEditing('new');
      const next = new URLSearchParams(params);
      next.delete('new');
      setParams(next, { replace: true });
    }
  }, [params, editing, setParams]);

  const editingAddress =
    typeof editing === 'string' && editing !== 'new'
      ? addresses.find((a) => a.id === editing)
      : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h2 text-text-primary">Saved addresses</h2>
          <p className="text-caption text-text-secondary mt-0.5">
            {addresses.length} {addresses.length === 1 ? 'address' : 'addresses'}
          </p>
        </div>
        {editing === null && (
          <Button leftIcon={<Plus size={18} />} onClick={() => setEditing('new')}>
            Add address
          </Button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {editing !== null && (
          <m.div
            key="form"
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={springs.snappy}
          >
            <AddressForm
              defaultValues={editingAddress ?? empty}
              onCancel={() => setEditing(null)}
              onSubmit={(data) => {
                if (editing === 'new') {
                  add(data);
                  toast.success('Address added');
                } else {
                  update(editing, data);
                  toast.success('Address updated');
                }
                setEditing(null);
              }}
              isEdit={editing !== 'new'}
            />
          </m.div>
        )}
      </AnimatePresence>

      {addresses.length === 0 ? (
        <EmptyAddresses onAdd={() => setEditing('new')} />
      ) : (
        <m.ul
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <AnimatePresence initial={false}>
            {addresses.map((a) => (
              <m.li
                key={a.id}
                layout
                variants={fadeUp}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
              >
                <AddressCard
                  address={a}
                  onEdit={() => setEditing(a.id)}
                  onDelete={() => {
                    remove(a.id);
                    toast(`Removed ${a.label}`, {
                      action: {
                        label: 'Undo',
                        onClick: () => add(a),
                      },
                    });
                  }}
                  onSetDefault={() => {
                    setDefault(a.id);
                    toast.success(`${a.label} is now your default`);
                  }}
                />
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>
      )}
    </div>
  );
}

function AddressCard({ address, onEdit, onDelete, onSetDefault }) {
  return (
    <article className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-4 md:p-5 h-full flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-body font-semibold text-text-primary">{address.label}</p>
            {address.isDefault && <Badge variant="primary">Default</Badge>}
          </div>
          <p className="mt-1 text-caption text-text-secondary line-clamp-1">{address.name}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit address"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary hover:bg-bg-muted hover:text-text-primary transition"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Remove address"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary hover:bg-danger-muted hover:text-danger transition"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="mt-3 text-body text-text-secondary">
        <p>
          {address.line1}
          {address.line2 ? `, ${address.line2}` : ''}
        </p>
        {address.landmark && <p className="text-caption text-text-tertiary">Near {address.landmark}</p>}
        <p>
          {address.city}, {address.state} {address.pincode}
        </p>
        {address.phone && (
          <p className="mt-1 text-caption text-text-tertiary tabular">+91 {address.phone}</p>
        )}
      </div>

      {!address.isDefault && (
        <button
          type="button"
          onClick={onSetDefault}
          className="mt-auto pt-3 inline-flex items-center gap-1.5 text-caption font-semibold text-primary hover:text-primary-hover self-start"
        >
          <Star size={14} />
          Set as default
        </button>
      )}
    </article>
  );
}

function AddressForm({ defaultValues, onCancel, onSubmit, isEdit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(addressSchema),
    defaultValues,
  });

  const label = watch('label');
  const isDefault = watch('isDefault');

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-5 md:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-h3 text-text-primary">
          {isEdit ? 'Edit address' : 'Add new address'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary hover:bg-bg-muted hover:text-text-primary transition"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-4">
        <label className="block text-label uppercase text-text-tertiary mb-1.5">Label</label>
        <div className="flex flex-wrap gap-1.5">
          {['Home', 'Office', 'Other'].map((opt) => {
            const active = label === opt;
            return (
              <button
                type="button"
                key={opt}
                onClick={() => setValue('label', opt, { shouldDirty: true })}
                className={clsx(
                  'px-3 h-9 rounded-full text-caption font-semibold border transition-colors',
                  active
                    ? 'bg-primary text-white border-primary'
                    : 'bg-bg-surface text-text-secondary border-border-subtle hover:border-border-strong hover:text-text-primary'
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field id="name" label="Recipient name" register={register('name')} error={errors.name?.message} />
        <Field
          id="phone"
          label="Phone"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          placeholder="98xxxxxx21"
          register={register('phone')}
          error={errors.phone?.message}
        />
        <Field
          id="line1"
          label="Address line 1"
          register={register('line1')}
          error={errors.line1?.message}
          className="sm:col-span-2"
        />
        <Field
          id="line2"
          label="Address line 2"
          register={register('line2')}
          error={errors.line2?.message}
          className="sm:col-span-2"
        />
        <Field id="landmark" label="Landmark" register={register('landmark')} error={errors.landmark?.message} />
        <Field
          id="pincode"
          label="Pincode"
          type="tel"
          inputMode="numeric"
          maxLength={6}
          register={register('pincode')}
          error={errors.pincode?.message}
        />
        <Field id="city" label="City" register={register('city')} error={errors.city?.message} />
        <Field id="state" label="State" register={register('state')} error={errors.state?.message} />
      </div>

      <label className="mt-4 inline-flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          {...register('isDefault')}
          className="h-4 w-4 rounded border-border-strong text-primary focus:ring-primary"
        />
        <span className="text-body text-text-secondary">Set as default address</span>
      </label>

      <div className="mt-5 flex flex-wrap gap-3 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          leftIcon={!isSubmitting && <Save size={18} />}
        >
          {isEdit ? 'Save changes' : 'Add address'}
        </Button>
      </div>
    </form>
  );
}

function Field({ id, label, error, register, className = '', ...rest }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-label uppercase text-text-tertiary mb-1.5">
        {label}
      </label>
      <input
        id={id}
        autoComplete="off"
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

function EmptyAddresses({ onAdd }) {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-8 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-muted text-primary">
        <MapPin size={22} />
      </span>
      <h3 className="mt-4 text-h3 text-text-primary">No addresses saved</h3>
      <p className="mt-2 text-body text-text-secondary">
        Add an address to speed up checkout next time.
      </p>
      <div className="mt-5 inline-block">
        <Button leftIcon={<Plus size={18} />} onClick={onAdd}>
          Add address
        </Button>
      </div>
    </div>
  );
}

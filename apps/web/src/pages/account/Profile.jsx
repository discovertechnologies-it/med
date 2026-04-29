import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'sonner';
import { Save, Phone } from 'lucide-react';
import clsx from 'clsx';
import Button from '@/components/Button';
import { useProfileStore } from '@/store/useProfileStore';
import { useAuthStore } from '@/store/useAuthStore';
import { profileSchema } from '@/validators/profileSchema';

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
      <SectionCard title="Personal details">
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
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <section className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-5 md:p-6">
      <h2 className="text-h2 text-text-primary">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
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

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Phone, ShieldCheck, Lock } from 'lucide-react';
import Button from '@/components/Button';
import OtpInput from '@/components/OtpInput';
import Logo from '@/components/Logo';
import { phoneSchema } from '@/validators/loginSchema';
import { requestOtp, verifyOtp, maskMobile } from '@/api/authApi';
import { useAuthStore } from '@/store/useAuthStore';
import { fadeUp, errorShake } from '@/motion/variants';

export default function Login() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const next = params.get('next') || '/';
  const login = useAuthStore((s) => s.login);

  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [mobile, setMobile] = useState('');

  const goToOtp = (m) => {
    setMobile(m);
    setStep('otp');
  };

  const onVerified = ({ user, accessToken }) => {
    login(user, accessToken);
    toast.success(`Welcome${user.name && user.name !== 'Friend' ? `, ${user.name}` : ''}`);
    navigate(next, { replace: true });
  };

  return (
    <main className="mx-auto max-w-screen-md px-4 py-10 md:py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <Logo className="justify-center" />
          <h1 className="mt-6 text-h1 md:text-h1-lg text-text-primary">
            {step === 'phone' ? 'Sign in to Med' : 'Verify your number'}
          </h1>
          <p className="mt-2 text-body text-text-secondary">
            {step === 'phone'
              ? 'Enter your mobile number to receive a one-time code.'
              : `We sent a 6-digit code to ${maskMobile(mobile)}.`}
          </p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {step === 'phone' ? (
            <m.div key="phone" variants={fadeUp} initial="initial" animate="animate" exit="exit">
              <PhoneStep onSubmit={goToOtp} />
            </m.div>
          ) : (
            <m.div key="otp" variants={fadeUp} initial="initial" animate="animate" exit="exit">
              <OtpStep
                mobile={mobile}
                onVerified={onVerified}
                onChangeNumber={() => setStep('phone')}
              />
            </m.div>
          )}
        </AnimatePresence>

        <div className="mt-8 grid grid-cols-3 gap-3 max-w-md mx-auto">
          <TrustItem icon={<ShieldCheck size={16} />} text="OTP only" />
          <TrustItem icon={<Lock size={16} />} text="Secure" />
          <TrustItem icon={<Phone size={16} />} text="No spam" />
        </div>

        <p className="mt-6 text-caption text-text-tertiary text-center">
          By continuing, you agree to our{' '}
          <Link to="/legal/terms" className="text-primary hover:underline">
            Terms
          </Link>{' '}
          and{' '}
          <Link to="/legal/privacy" className="text-primary hover:underline">
            Privacy policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}

function PhoneStep({ onSubmit }) {
  const reduce = useReducedMotion();
  const [shake, setShake] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: yupResolver(phoneSchema),
    mode: 'onSubmit',
    defaultValues: { mobile: '' },
  });

  const submit = async ({ mobile }) => {
    try {
      await requestOtp(mobile);
      toast.success(`OTP sent to ${maskMobile(mobile)}`);
      onSubmit(mobile);
    } catch (e) {
      setError('mobile', { message: e.message });
      if (!reduce) {
        setShake(true);
        setTimeout(() => setShake(false), 350);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="mt-8 space-y-4">
      <div>
        <label
          htmlFor="mobile"
          className="block text-label uppercase text-text-tertiary mb-1.5"
        >
          Mobile number
        </label>
        <m.div
          animate={shake ? errorShake : {}}
          className="flex items-stretch rounded-full bg-bg-surface border border-border-subtle hover:border-border-strong focus-within:border-primary transition-colors overflow-hidden"
        >
          <span className="inline-flex items-center px-4 text-body font-semibold text-text-secondary border-r border-border-subtle bg-bg-muted">
            +91
          </span>
          <input
            id="mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="98xxxxxx21"
            maxLength={10}
            aria-invalid={Boolean(errors.mobile)}
            aria-describedby={errors.mobile ? 'mobile-error' : undefined}
            className="flex-1 h-11 px-4 bg-transparent text-text-primary placeholder:text-text-tertiary outline-none tabular"
            {...register('mobile')}
          />
        </m.div>
        {errors.mobile && (
          <p id="mobile-error" className="mt-1.5 text-caption text-danger">
            {errors.mobile.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={isSubmitting}
        rightIcon={!isSubmitting && <ArrowRight size={18} />}
      >
        {isSubmitting ? 'Sending OTP' : 'Continue'}
      </Button>
    </form>
  );
}

function OtpStep({ mobile, onVerified, onChangeNumber }) {
  const reduce = useReducedMotion();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  // Resend timer
  const [secondsLeft, setSecondsLeft] = useState(30);
  const timerRef = useRef(null);
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const handleVerify = async (code) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await verifyOtp({ mobile, otp: code });
      onVerified(res);
    } catch (e) {
      setError(e.message);
      setOtp('');
      if (!reduce) {
        setShake(true);
        setTimeout(() => setShake(false), 350);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      await requestOtp(mobile);
      toast.success('New OTP sent');
      setSecondsLeft(30);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <m.div animate={shake ? errorShake : {}}>
        <OtpInput
          value={otp}
          onChange={(v) => {
            setOtp(v);
            if (error) setError(null);
          }}
          onComplete={(v) => handleVerify(v)}
          disabled={submitting}
          hasError={Boolean(error)}
        />
      </m.div>

      {error && (
        <p role="alert" className="text-caption text-danger text-center">
          {error}
        </p>
      )}

      <Button
        type="button"
        fullWidth
        size="lg"
        loading={submitting}
        disabled={otp.replace(/\s/g, '').length !== 6}
        onClick={() => handleVerify(otp)}
        rightIcon={!submitting && <ArrowRight size={18} />}
      >
        {submitting ? 'Verifying' : 'Verify and continue'}
      </Button>

      <div className="flex items-center justify-between text-caption">
        <button
          type="button"
          onClick={onChangeNumber}
          className="inline-flex items-center gap-1 text-text-secondary hover:text-text-primary font-semibold"
        >
          <ArrowLeft size={14} />
          Change number
        </button>
        {secondsLeft > 0 ? (
          <span className="text-text-tertiary tabular">Resend in {secondsLeft}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="text-primary font-semibold hover:text-primary-hover"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
}

function TrustItem({ icon, text }) {
  return (
    <div className="flex flex-col items-center gap-1.5 bg-bg-surface border border-border-subtle rounded-xl p-3 text-center">
      <span className="text-primary">{icon}</span>
      <span className="text-caption text-text-secondary">{text}</span>
    </div>
  );
}

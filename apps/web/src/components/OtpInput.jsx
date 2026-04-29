import { useEffect, useMemo, useRef } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';
import { springs } from '@/motion/transitions';

export default function OtpInput({
  length = 6,
  value = '',
  onChange,
  onComplete,
  autoFocus = true,
  disabled = false,
  hasError = false,
}) {
  const reduce = useReducedMotion();
  const inputs = useRef([]);
  const digits = useMemo(() => value.padEnd(length, ' ').slice(0, length).split(''), [value, length]);

  useEffect(() => {
    if (autoFocus && inputs.current[0]) inputs.current[0].focus();
  }, [autoFocus]);

  const setDigit = (idx, digit) => {
    const arr = digits.map((d) => (d === ' ' ? '' : d));
    arr[idx] = digit;
    const next = arr.join('').slice(0, length);
    onChange?.(next);
    if (next.length === length && next.replace(/\s/g, '').length === length) {
      onComplete?.(next);
    }
  };

  const focusAt = (idx) => {
    const i = Math.max(0, Math.min(idx, length - 1));
    inputs.current[i]?.focus();
    inputs.current[i]?.select?.();
  };

  const handleChange = (idx, e) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) {
      setDigit(idx, '');
      return;
    }
    if (raw.length === 1) {
      setDigit(idx, raw);
      if (idx < length - 1) focusAt(idx + 1);
    } else {
      // Browser autofill or paste landed in this box
      const arr = raw.slice(0, length).split('');
      const filled = digits.map((d) => (d === ' ' ? '' : d));
      arr.forEach((c, i) => {
        if (idx + i < length) filled[idx + i] = c;
      });
      const next = filled.join('').slice(0, length);
      onChange?.(next);
      const last = Math.min(idx + arr.length, length - 1);
      focusAt(last);
      if (next.replace(/\s/g, '').length === length) onComplete?.(next);
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace') {
      if (digits[idx] && digits[idx] !== ' ') {
        setDigit(idx, '');
      } else if (idx > 0) {
        setDigit(idx - 1, '');
        focusAt(idx - 1);
      }
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      focusAt(idx - 1);
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      focusAt(idx + 1);
      e.preventDefault();
    }
  };

  const handlePaste = (idx, e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '');
    if (!pasted) return;
    e.preventDefault();
    const arr = pasted.slice(0, length - idx).split('');
    const filled = digits.map((d) => (d === ' ' ? '' : d));
    arr.forEach((c, i) => {
      if (idx + i < length) filled[idx + i] = c;
    });
    const next = filled.join('').slice(0, length);
    onChange?.(next);
    const last = Math.min(idx + arr.length, length - 1);
    focusAt(last);
    if (next.replace(/\s/g, '').length === length) onComplete?.(next);
  };

  return (
    <div className="flex gap-2 sm:gap-3">
      {digits.map((d, i) => {
        const filled = d && d !== ' ';
        return (
          <m.div
            key={i}
            animate={filled && !reduce ? { scale: [1, 1.08, 1] } : {}}
            transition={springs.snappy}
            className="flex-1"
          >
            <input
              ref={(el) => (inputs.current[i] = el)}
              type="tel"
              inputMode="numeric"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              maxLength={length}
              disabled={disabled}
              value={d === ' ' ? '' : d}
              onChange={(e) => handleChange(i, e)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={(e) => handlePaste(i, e)}
              onFocus={(e) => e.target.select()}
              aria-label={`Digit ${i + 1} of ${length}`}
              className={clsx(
                'w-full h-12 sm:h-14 text-center rounded-xl border bg-bg-surface transition-colors',
                'text-h2 font-bold tabular',
                filled ? 'border-primary text-text-primary' : 'border-border-subtle text-text-primary',
                hasError && 'border-danger text-danger',
                'hover:border-border-strong focus:border-primary focus:outline-none disabled:bg-bg-muted'
              )}
            />
          </m.div>
        );
      })}
    </div>
  );
}

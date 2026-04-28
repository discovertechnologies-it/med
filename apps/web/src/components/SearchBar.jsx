import { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import clsx from 'clsx';

const SearchBar = forwardRef(function SearchBar(
  { value, onChange, onSubmit, onClear, placeholder = 'Search by medicine, salt, or brand', className, autoFocus = false },
  ref
) {
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value);
      }}
      className={clsx('relative w-full', className)}
    >
      <span className="absolute inset-y-0 left-3 inline-flex items-center text-text-tertiary" aria-hidden>
        <Search size={18} />
      </span>
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        spellCheck={false}
        className={clsx(
          'h-11 w-full pl-10 pr-10 rounded-full',
          'bg-bg-surface border border-border-subtle text-text-primary',
          'placeholder:text-text-tertiary',
          'hover:border-border-strong focus:border-primary',
          'transition-colors'
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange?.('');
            onClear?.();
          }}
          aria-label="Clear search"
          className="absolute inset-y-0 right-2 my-auto h-8 w-8 inline-flex items-center justify-center rounded-full text-text-tertiary hover:bg-bg-muted hover:text-text-primary transition"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
});

export default SearchBar;

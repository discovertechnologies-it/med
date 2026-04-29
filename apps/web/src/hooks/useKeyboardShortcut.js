import { useEffect } from 'react';

// Subscribe to a keyboard combo. handler receives the event.
// combo example: { key: 'k', meta: true } — Cmd+K on Mac, Ctrl+K elsewhere.
export function useKeyboardShortcut({ key, meta = false, ctrl = false, shift = false, alt = false }, handler) {
  useEffect(() => {
    const onKeyDown = (e) => {
      const target = e.target;
      const tagName = target?.tagName;
      const isEditable =
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        tagName === 'SELECT' ||
        target?.isContentEditable;

      const matches =
        e.key.toLowerCase() === key.toLowerCase() &&
        (!meta || e.metaKey || e.ctrlKey) &&
        (!ctrl || e.ctrlKey) &&
        (!shift || e.shiftKey) &&
        (!alt || e.altKey);

      // Allow Cmd+K even inside inputs (it's the universal palette gesture)
      if (matches) {
        if (isEditable && !meta && !ctrl) return;
        e.preventDefault();
        handler(e);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [key, meta, ctrl, shift, alt, handler]);
}

export const isMac =
  typeof navigator !== 'undefined' && /mac|iphone|ipad|ipod/i.test(navigator.platform || '');

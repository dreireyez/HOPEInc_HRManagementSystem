import { useState, useCallback, useRef } from 'react';

/**
 * Hook that manages toast notification state.
 * Returns { toasts, push, dismiss }.
 *
 * @returns {{ toasts: Array, push: Function, dismiss: Function }}
 *
 * Usage:
 *   const toast = useToast();
 *   toast.push('Saved!');
 *   toast.push('Something went wrong', 'error');
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const push = useCallback((message, type = 'success') => {
    const id = ++counterRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4000,
    );
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, push, dismiss };
}

import { useEffect, useState } from 'react';
import { subscribe, type MfeEvents } from '@bank/contracts';

type Toast = MfeEvents['shell:notify'] & { id: number };

/** Shell-owned UI that any MFE can trigger through the 'shell:notify' event. */
export function Toasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(
    () =>
      subscribe('shell:notify', (t) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { ...t, id }]);
        setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4000);
      }),
    [],
  );

  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.tone}`}>{t.message}</div>
      ))}
    </div>
  );
}

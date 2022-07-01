/**
 * The typed contract between micro-frontends.
 * MFEs never import each other's code; they communicate only through these events.
 * Changing a payload is a breaking change — version it like a public API.
 */
export interface MfeEvents {
  /** Accounts → Payments: user chose "Pay from this account". */
  'payments:start': { accountId: string; accountName: string; available: number };
  /** Payments → Accounts (and anyone else): a payment was made. */
  'payments:completed': { paymentId: string; accountId: string; amount: number; payee: string };
  /** Any MFE → Shell: show a toast. */
  'shell:notify': { message: string; tone: 'success' | 'error' | 'info' };
}

export type MfeEventName = keyof MfeEvents;

const PREFIX = 'mfe:';

/**
 * Publishes a typed event on window. Works across separately built and deployed bundles,
 * because every MFE shares the same window — no shared module instance needed.
 */
export function publish<K extends MfeEventName>(name: K, payload: MfeEvents[K]): void {
  window.dispatchEvent(new CustomEvent(PREFIX + name, { detail: payload }));
}

/** Subscribes to a typed event. Returns an unsubscribe function (use it in useEffect cleanup). */
export function subscribe<K extends MfeEventName>(name: K, handler: (payload: MfeEvents[K]) => void): () => void {
  const listener = (e: Event) => handler((e as CustomEvent<MfeEvents[K]>).detail);
  window.addEventListener(PREFIX + name, listener);
  return () => window.removeEventListener(PREFIX + name, listener);
}

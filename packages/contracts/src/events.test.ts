import { describe, it, expect, vi } from 'vitest';
import { publish, subscribe } from './events';

describe('MFE event bus', () => {
  it('delivers typed payloads to subscribers', () => {
    const handler = vi.fn();
    const off = subscribe('payments:completed', handler);
    publish('payments:completed', { paymentId: 'p1', accountId: 'a1', amount: 500, payee: 'Electricity' });
    expect(handler).toHaveBeenCalledWith({ paymentId: 'p1', accountId: 'a1', amount: 500, payee: 'Electricity' });
    off();
  });

  it('stops delivering after unsubscribe', () => {
    const handler = vi.fn();
    const off = subscribe('shell:notify', handler);
    off();
    publish('shell:notify', { message: 'hi', tone: 'info' });
    expect(handler).not.toHaveBeenCalled();
  });

  it('isolates events by name', () => {
    const handler = vi.fn();
    const off = subscribe('payments:start', handler);
    publish('shell:notify', { message: 'hi', tone: 'info' });
    expect(handler).not.toHaveBeenCalled();
    off();
  });
});

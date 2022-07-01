import { useEffect, useState, type FormEvent } from 'react';
import { formatMoney, publish, subscribe, type MfeEvents } from '@bank/contracts';
import styles from './PaymentsWidget.module.css';

type Source = MfeEvents['payments:start'];
interface Payment { id: string; payee: string; amount: number; from: string }

export default function PaymentsWidget() {
  const [source, setSource] = useState<Source | null>(null);
  const [payee, setPayee] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Payment[]>([]);

  useEffect(() => subscribe('payments:start', (s) => { setSource(s); setError(null); }), []);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!source) return setError('Choose an account to pay from.');
    const value = Number(amount);
    if (!payee.trim()) return setError('Enter a payee.');
    if (!Number.isFinite(value) || value <= 0) return setError('Enter an amount greater than zero.');
    if (value > source.available) return setError(`Amount exceeds the available ${formatMoney(source.available)}.`);

    const payment = { paymentId: crypto.randomUUID(), accountId: source.accountId, amount: value, payee: payee.trim() };
    publish('payments:completed', payment);
    publish('shell:notify', { message: `Paid ${formatMoney(value)} to ${payment.payee}`, tone: 'success' });
    setHistory((h) => [{ id: payment.paymentId, payee: payment.payee, amount: value, from: source.accountName }, ...h]);
    setSource({ ...source, available: source.available - value });
    setPayee(''); setAmount(''); setError(null);
  }

  return (
    <section className={styles.card} aria-labelledby="payments-heading">
      <h2 id="payments-heading">Make a payment</h2>
      <p className={styles.source}>
        {source ? <>From <strong>{source.accountName}</strong>, {formatMoney(source.available)} available</> : 'Choose an account to pay from.'}
      </p>
      <form onSubmit={submit} className={styles.form} noValidate>
        <label>Payee<input value={payee} onChange={(e) => setPayee(e.target.value)} disabled={!source} /></label>
        <label>Amount (₹)<input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} disabled={!source} /></label>
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <button type="submit" disabled={!source}>Pay</button>
      </form>
      {history.length > 0 && (
        <ul className={styles.history} aria-label="Recent payments">
          {history.map((p) => (
            <li key={p.id}><span>{p.payee} <small>from {p.from}</small></span><span>{formatMoney(p.amount)}</span></li>
          ))}
        </ul>
      )}
    </section>
  );
}

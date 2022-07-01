import { useEffect, useState } from 'react';
import { formatMoney, publish, subscribe } from '@bank/contracts';
import styles from './AccountsWidget.module.css';

interface Account {
  id: string;
  name: string;
  number: string;
  balance: number;
}

const SEED: Account[] = [
  { id: 'acc-sav', name: 'Savings', number: '•••• 4821', balance: 182450.75 },
  { id: 'acc-cur', name: 'Current', number: '•••• 1096', balance: 54210.0 },
  { id: 'acc-sal', name: 'Salary', number: '•••• 7734', balance: 96800.4 },
];

export default function AccountsWidget() {
  const [accounts, setAccounts] = useState(SEED);

  // React to payments made in another MFE — no shared state, only the event contract.
  useEffect(
    () =>
      subscribe('payments:completed', ({ accountId, amount }) =>
        setAccounts((prev) => prev.map((a) => (a.id === accountId ? { ...a, balance: a.balance - amount } : a))),
      ),
    [],
  );

  const total = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <section className={styles.card} aria-labelledby="accounts-heading">
      <header className={styles.header}>
        <h2 id="accounts-heading">Accounts</h2>
        <span className={styles.total}>{formatMoney(total)}</span>
      </header>
      <ul className={styles.list}>
        {accounts.map((a) => (
          <li key={a.id} className={styles.row}>
            <div>
              <div className={styles.name}>{a.name}</div>
              <div className={styles.number}>{a.number}</div>
            </div>
            <div className={styles.balance}>{formatMoney(a.balance)}</div>
            <button
              type="button"
              className={styles.pay}
              onClick={() => publish('payments:start', { accountId: a.id, accountName: a.name, available: a.balance })}
            >
              Pay from {a.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

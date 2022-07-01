import { RemoteBoundary } from './RemoteBoundary';
import { Toasts } from './Toasts';

export default function App() {
  return (
    <>
      <header className="topbar">
        <span className="brand">Northbank</span>
        <span className="user">Signed in as Demo Customer</span>
      </header>
      <main className="layout">
        <RemoteBoundary name="Accounts" load={() => import('accounts/AccountsWidget')} />
        <RemoteBoundary name="Payments" load={() => import('payments/PaymentsWidget')} />
      </main>
      <Toasts />
    </>
  );
}

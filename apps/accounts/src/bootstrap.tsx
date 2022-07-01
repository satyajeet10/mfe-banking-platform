import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AccountsWidget from './AccountsWidget';

// Standalone mode: the accounts team can run and test its MFE without the shell.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main style={{ maxWidth: 720, margin: '32px auto', fontFamily: 'system-ui, sans-serif' }}>
      <AccountsWidget />
    </main>
  </StrictMode>,
);

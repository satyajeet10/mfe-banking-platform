import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PaymentsWidget from './PaymentsWidget';

// Standalone mode: the payments team can run and test its MFE without the shell.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main style={{ maxWidth: 720, margin: '32px auto', fontFamily: 'system-ui, sans-serif' }}>
      <PaymentsWidget />
    </main>
  </StrictMode>,
);

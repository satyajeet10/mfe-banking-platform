import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

// Remote URLs come from the environment, so each remote can be deployed (and rolled back)
// independently without rebuilding the shell.
const ACCOUNTS = process.env.ACCOUNTS_REMOTE ?? 'http://localhost:3001/mf-manifest.json';
const PAYMENTS = process.env.PAYMENTS_REMOTE ?? 'http://localhost:3002/mf-manifest.json';

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      dts: false, // remote types are declared explicitly in the shell's remotes.d.ts
      name: 'shell',
      // 'loaded-first' avoids fetching every remote at startup to negotiate shared versions,
      // so one remote being down can't block the whole shell from rendering.
      shareStrategy: 'loaded-first',
      remotes: { accounts: `accounts@${ACCOUNTS}`, payments: `payments@${PAYMENTS}` },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
      },
    }),
  ],
  server: { port: 3000 },
  html: { title: 'Northbank — Online Banking' },
});

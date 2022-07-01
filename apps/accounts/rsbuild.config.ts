import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

// Remote: builds and deploys on its own. The shell loads './AccountsWidget' at runtime from mf-manifest.json.
export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      dts: false, // remote types are declared explicitly in the shell's remotes.d.ts
      name: 'accounts',
      exposes: { './AccountsWidget': './src/AccountsWidget.tsx' },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
      },
    }),
  ],
  server: { port: 3001, cors: true },
  output: { assetPrefix: 'auto' },
  html: { title: 'accounts (standalone)' },
});

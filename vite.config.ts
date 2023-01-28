import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  test: {
    environment: 'happy-dom',
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReplaceKeywords',
      // the proper extensions will be added
      fileName: 'replace-keywords',
    },
  },
  plugins: [dts({ insertTypesEntry: true })],
});

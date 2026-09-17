import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'build',
  format: ['esm', 'cjs'],
  dts: true,
  platform: 'node',
  target: 'es2015',
  clean: true,
  outputOptions: {
    exports: 'named',
  },
});

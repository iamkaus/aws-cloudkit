import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    's3/index': 'src/s3/index.ts',
    'sqs/index': 'src/sqs/index.ts',
  },

  format: ['esm'],

  dts: true,

  sourcemap: true,

  clean: true,

  external: [
    '@aws-sdk/client-s3',
    '@aws-sdk/client-sqs',
    '@aws-sdk/client-sesv2',
    '@aws-sdk/client-secrets-manager',
  ],
});
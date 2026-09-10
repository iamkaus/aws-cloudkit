import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    's3/index': 'src/s3-service/index.ts',
    'sqs/index': 'src/sqs-service/index.ts',
    'lambda/index': 'src/lambda-service/index.ts',
  },

  format: ['esm'],

  dts: {
    compilerOptions: {
      ignoreDeprecations: '6.0',
    },
  },

  sourcemap: true,

  clean: true,

  external: [
    '@aws-sdk/client-s3',
    '@aws-sdk/client-sqs',
    '@aws-sdk/client-sesv2',
    '@aws-sdk/client-secrets-manager',
  ],
});

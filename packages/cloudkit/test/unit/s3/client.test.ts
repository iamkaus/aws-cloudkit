import { describe, expect, it } from 'vitest';
import { createS3Client } from '../../../src/index.js';

describe('createS3Client', () => {
  it('creates a S3Client with provided configurations', async () => {
    const client = createS3Client({
      region: 'ap-south-1',
      credentials: {
        accessKeyId: 'test-access-key',
        secretAccessKey: 'test-secret-key',
      },
    });

    expect(client).toBeInstanceOf(Object);

    expect(await client.config.region()).toBe('ap-south-1');

    expect(await client.config.credentials()).toMatchObject({
      accessKeyId: 'test-access-key',
      secretAccessKey: 'test-secret-key',
    });
  });

  it('passes additional SQS configuration to the client', async () => {
    const client = createS3Client({
      region: 'ap-south-1',
      credentials: {
        accessKeyId: 'test-access-key',
        secretAccessKey: 'test-secret-key',
      },
      maxAttempts: 5,
    });

    expect(await client.config.region()).toBe('ap-south-1');
    expect(await client.config.maxAttempts()).toBe(5);
  });
});

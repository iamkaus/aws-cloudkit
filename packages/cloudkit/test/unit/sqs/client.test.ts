import { describe, expect, it } from 'vitest';
import { createSQSClient } from '../../../src/sqs-service/client.js';

describe('createSQSClient', () => {
  it('creates an SQSClient with the provided configuration', async () => {
    const client = createSQSClient({
      region: 'us-east-1',
      accessKey: 'test-access-key',
      secretKey: 'test-secret-key',
    });

    expect(client).toBeInstanceOf(Object);

    expect(await client.config.region()).toBe('us-east-1');

    expect(await client.config.credentials()).toMatchObject({
      accessKeyId: 'test-access-key',
      secretAccessKey: 'test-secret-key',
    });
  });

  it('passes additional SQS configuration to the client', async () => {
    const client = createSQSClient({
      region: 'us-east-1',
      accessKey: 'test-access-key',
      secretKey: 'test-secret-key',
      maxAttempts: 5,
    });

    expect(await client.config.region()).toBe('us-east-1');
    expect(await client.config.maxAttempts()).toBe(5);
  });
});

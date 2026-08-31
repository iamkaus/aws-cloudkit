import { beforeEach, describe, vi, expect, it } from 'vitest';

import { createLambdaClient } from '../../../src/lambda-service/client.js';

describe('createLambdaClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('creates a LambdaClient with the provided configuration', async () => {
    const client = createLambdaClient({
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

  it('passes additional Lambda configuration to the client', async () => {
    const client = createLambdaClient({
      region: 'us-east-1',
      accessKey: 'test-access-key',
      secretKey: 'test-secret-key',
      maxAttempts: 5,
    });

    expect(await client.config.region()).toBe('us-east-1');
    expect(await client.config.maxAttempts()).toBe(5);
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { getObjectSignedUrl } from '../../../src/s3-service/getObjectSignedUrl.js';

vi.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: vi.fn(),
}));

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

describe('getObjectSignedUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates a signed URL with the provided parameters', async () => {
    vi.mocked(getSignedUrl).mockResolvedValue('https://example.com/signed-get-url');

    const client = new S3Client({
      region: 'us-east-1',
    });

    const response = await getObjectSignedUrl({
      client,
      Bucket: 'test-bucket',
      Key: 'test.txt',
      expiresIn: 1800,
    });

    expect(response).toBe('https://example.com/signed-get-url');

    expect(getSignedUrl).toHaveBeenCalledOnce();

    expect(getSignedUrl).toHaveBeenCalledWith(client, expect.any(GetObjectCommand), {
      expiresIn: 1800,
    });

    const command = vi.mocked(getSignedUrl).mock.calls[0]![1];

    expect(command.input).toEqual({
      Bucket: 'test-bucket',
      Key: 'test.txt',
    });
  });

  it('uses 3600 seconds as the default expiration', async () => {
    vi.mocked(getSignedUrl).mockResolvedValue('https://example.com/signed-get-url');

    const client = new S3Client({
      region: 'us-east-1',
    });

    await getObjectSignedUrl({
      client,
      Bucket: 'test-bucket',
      Key: 'test.txt',
    });

    expect(getSignedUrl).toHaveBeenCalledOnce();

    expect(getSignedUrl).toHaveBeenCalledWith(client, expect.any(GetObjectCommand), {
      expiresIn: 3600,
    });
  });
});

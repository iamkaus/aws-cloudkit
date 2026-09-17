import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CreateBucketCommand, S3Client } from '@aws-sdk/client-s3';

import { createS3BucketSignedUrl } from '../../../src/s3-service/createS3Bucket.js';

vi.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: vi.fn(),
}));

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

describe('createS3BucketSignedUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates a signed URL with the provided parameters', async () => {
    vi.mocked(getSignedUrl).mockResolvedValue('https://example.com/signed-create-bucket-url');

    const client = new S3Client({
      region: 'us-east-1',
    });

    const response = await createS3BucketSignedUrl({
      client,
      Bucket: 'test-bucket',
      ACL: 'private',
      ObjectLockEnabledForBucket: false,
      expiresIn: 1800,
    });

    expect(response).toBe('https://example.com/signed-create-bucket-url');

    expect(getSignedUrl).toHaveBeenCalledOnce();

    expect(getSignedUrl).toHaveBeenCalledWith(client, expect.any(CreateBucketCommand), {
      expiresIn: 1800,
    });

    const command = vi.mocked(getSignedUrl).mock.calls[0]![1];

    expect(command.input).toEqual({
      Bucket: 'test-bucket',
      ACL: 'private',
      ObjectLockEnabledForBucket: false,
    });
  });

  it('uses 3600 seconds as the default expiration', async () => {
    vi.mocked(getSignedUrl).mockResolvedValue('https://example.com/signed-create-bucket-url');

    const client = new S3Client({
      region: 'us-east-1',
    });

    await createS3BucketSignedUrl({
      client,
      Bucket: 'test-bucket',
      expiresIn: 3600,
    });

    expect(getSignedUrl).toHaveBeenCalledOnce();

    expect(getSignedUrl).toHaveBeenCalledWith(client, expect.any(CreateBucketCommand), {
      expiresIn: 3600,
    });
  });
});

import { beforeEach, describe, vi, expect, it } from 'vitest';
import { deleteObjectSignedUrl } from '../../../src/index.js';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

vi.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: vi.fn(),
}));

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

describe('deleteObjectSignedUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a signed url with provided parameters', async () => {
    vi.mocked(getSignedUrl).mockResolvedValue('https://example.com/signed-delete-url');

    const client = new S3Client({
      region: 'us-east-1',
    });

    const response = await deleteObjectSignedUrl(
      {
        client,
        Bucket: 'test-bucket',
        Key: 'test.txt',
        VersionId: 'version-123',
      },
      1800,
    );

    expect(response).toBe('https://example.com/signed-delete-url');

    expect(getSignedUrl).toHaveBeenCalledOnce();
    expect(getSignedUrl).toHaveBeenCalledWith(client, expect.any(DeleteObjectCommand), {
      expiresIn: 1800,
    });

    const command = vi.mocked(getSignedUrl).mock.calls[0]![1];

    expect(command.input).toEqual({
      Bucket: 'test-bucket',
      Key: 'test.txt',
      VersionId: 'version-123',
    });
  });

  it('uses 3600 seconds as the default expiration', async () => {
    vi.mocked(getSignedUrl).mockResolvedValue('https://example.com/signed-delete-url');

    const client = new S3Client({
      region: 'us-east-1',
    });

    await deleteObjectSignedUrl({
      client,
      Bucket: 'test-bucket',
      Key: 'test.txt',
      VersionId: 'version-123',
    });

    expect(getSignedUrl).toHaveBeenCalledOnce();

    expect(getSignedUrl).toHaveBeenCalledWith(client, expect.any(DeleteObjectCommand), {
      expiresIn: 3600,
    });
  });
});

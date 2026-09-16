import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  type BucketLocationConstraint,
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

import {
  createS3BucketSignedUrl,
  deleteObjectSignedUrl,
  getObjectSignedUrl,
  putObjectSignedUrl,
} from '../../../src/s3-service/index.js';

import {
  AWS_REGION,
  AWS_USER_ACCESS_KEY,
  AWS_USER_SECRET_KEY,
} from '../../../config/env.config.js';
import { createS3Client } from '../../../dist/index.js';

/**
 * Asserts a fetch response was ok. On failure, reads the response body
 * (S3 error responses are XML: <Error><Code>...</Code><Message>...</Message></Error>)
 * and folds it into the assertion message, so a failing CI run is
 * self-explanatory without needing extra console.log round trips.
 */
async function expectOk(response: Response, label: string): Promise<void> {
  if (!response.ok) {
    const body = await response.text();
    expect.fail(`${label} failed: ${response.status} ${response.statusText}\n${body}`);
  }
}

describe('S3 integration', () => {
  const region = AWS_REGION;

  if (!region) {
    throw new Error('AWS_REGION is required for S3 integration tests');
  }

  const client = createS3Client({
    region,
    accessKey: AWS_USER_ACCESS_KEY,
    secretKey: AWS_USER_SECRET_KEY,
  });

  const bucketName = `cloudkit-integration-${Date.now()}`;
  const objectKey = 'integration-test.txt';
  const objectContent = 'Hello from CloudKit integration tests';

  // The bucket is created through a normal (non-presigned) SDK call, not
  // through the signed URL. CreateBucket outside us-east-1 needs a
  // LocationConstraint XML body, and a presigned PUT signs Content-Length
  // against that exact serialized body — reconstructing a byte-identical
  // body outside the SDK's own XML marshaller isn't practical for a test
  // to do from the outside. put/get/delete don't have this problem: their
  // payloads are UNSIGNED-PAYLOAD, so those signed URLs can be invoked
  // directly with fetch with no special handling.
  beforeAll(async () => {
    await client.send(
      new CreateBucketCommand({
        Bucket: bucketName,
        ...(region !== 'us-east-1' && {
          CreateBucketConfiguration: {
            LocationConstraint: region as BucketLocationConstraint,
          },
        }),
      }),
    );
  });

  afterAll(async () => {
    try {
      await client.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: objectKey,
        }),
      );
    } catch {
      // Ignore cleanup errors.
    }

    try {
      await client.send(
        new DeleteBucketCommand({
          Bucket: bucketName,
        }),
      );
    } catch {
      // Ignore cleanup errors.
    }
  });

  // NOTE: put/get/delete are order-dependent on each other (the object
  // must exist before it's fetched or deleted) and all depend on the
  // bucket created in beforeAll. Vitest runs `it` blocks within a
  // `describe` sequentially by default, so this holds as long as nothing
  // here is marked `.concurrent`.

  /**
   * Smoke test only — this does NOT prove the URL actually works against S3.
   *
   * Presigning is a pure client-side computation (SigV4 math over the
   * request the SDK would have sent); it never touches the network, so
   * this passes even if `bucketName` is never created and even if the
   * bucket already exists.
   *
   * We don't invoke this URL with fetch() here (unlike the put/get/delete
   * tests below) because CreateBucket outside us-east-1 requires a
   * LocationConstraint XML body, and the SDK signs Content-Length against
   * that exact serialized body. Reconstructing a byte-identical XML body
   * from outside the SDK's own marshaller isn't practical, so an
   * unmatched Content-Length here would fail with SignatureDoesNotMatch
   * even though the signing logic itself is correct — see the bucket
   * creation in beforeAll, which is a real SDK call instead.
   *
   * TODO: if we want this to actually prove the URL is usable (not just
   * well-formed), either:
   *   (a) reconstruct the exact CreateBucketConfiguration XML body and
   *       send it as the fetch body, matching the signed Content-Length, or
   *   (b) have createS3BucketSignedUrl return the body it signed alongside
   *       the URL, so the test can replay it exactly.
   * Until then, this only catches gross breakage (wrong protocol, bucket
   * name missing from the URL) — not a subtly broken signature.
   */

  it('generates a signed URL for creating a bucket', async () => {
    const createBucketUrl = await createS3BucketSignedUrl({
      client,
      Bucket: bucketName,
    });

    expect(createBucketUrl).toMatch(/^https?:\/\//);
    expect(createBucketUrl).toContain(bucketName);
  });

  it('uploads an object using a put signed URL', async () => {
    const putUrl = await putObjectSignedUrl({
      client,
      Bucket: bucketName,
      Key: objectKey,
      ContentType: 'text/plain',
    });

    expect(putUrl).toMatch(/^https?:\/\//);

    const uploadResponse = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: objectContent,
    });

    await expectOk(uploadResponse, 'putObject');
  });

  it('downloads an object using a get signed URL', async () => {
    const getUrl = await getObjectSignedUrl({
      client,
      Bucket: bucketName,
      Key: objectKey,
    });

    expect(getUrl).toMatch(/^https?:\/\//);

    // No Content-Type header here — GetObject signed URLs don't sign this
    // header, so sending it can trigger a SignatureDoesNotMatch 403.
    const downloadResponse = await fetch(getUrl, {
      method: 'GET',
    });

    await expectOk(downloadResponse, 'getObject');

    const downloadedContent = await downloadResponse.text();

    expect(downloadedContent).toBe(objectContent);
  });

  it('deletes an object using a delete signed URL', async () => {
    const deleteUrl = await deleteObjectSignedUrl({
      client,
      Bucket: bucketName,
      Key: objectKey,
    });

    expect(deleteUrl).toMatch(/^https?:\/\//);

    const deleteResponse = await fetch(deleteUrl, {
      method: 'DELETE',
    });

    await expectOk(deleteResponse, 'deleteObject');
  });
});

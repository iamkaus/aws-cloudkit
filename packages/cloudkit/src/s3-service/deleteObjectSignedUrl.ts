import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface DeleteObjectSignedUrlParams {
  bucket: string;
  key: string;
  versionId?: string;
  client: S3Client;
  expiresIn: number;
}

export const deleteObjectSignedUrl = async ({
  bucket,
  key,
  versionId,
  client,
  expiresIn = 3600,
}: DeleteObjectSignedUrlParams): Promise<string> => {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
    ...(versionId && { VersionId: versionId }),
  });

  return getSignedUrl(client, command, {
    expiresIn: expiresIn,
  });
};

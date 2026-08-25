import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface PutObjectSignedUrlParams {
  bucket: string;
  key: string;
  contentType: string;
  client: S3Client;
  expiresIn: number;
}

export const putObjectSignedUrl = async ({
  bucket,
  key,
  contentType,
  client,
  expiresIn = 3600,
}: PutObjectSignedUrlParams): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(client, command, {
    expiresIn: expiresIn,
  });
};

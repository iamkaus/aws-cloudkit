import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface S3GetObjectSignedUrlParams {
  bucket: string;
  key: string;
  client: S3Client;
  expiresIn?: number;
}

export const getObjectSignedUrl = async ({
  bucket,
  key,
  client,
  expiresIn = 3600,
}: S3GetObjectSignedUrlParams): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(client, command, {
    expiresIn,
  });
};

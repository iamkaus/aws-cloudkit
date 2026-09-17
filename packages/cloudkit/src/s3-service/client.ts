import { S3Client, type S3ClientConfig } from '@aws-sdk/client-s3';

export const createS3Client = (params: S3ClientConfig): S3Client => {
  return new S3Client(params);
};

import {
  S3Client,
  S3ClientConfig
} from '@aws-sdk/client-s3';

type S3ClientParams = S3ClientConfig & {
  accessKey: string;
  secretKey: string;
};

export const createS3Client = (params: S3ClientParams): S3Client => {
  const { accessKey, secretKey, ...awsS3Config } = params;
  return new S3Client({
    ...awsS3Config,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
  });
};

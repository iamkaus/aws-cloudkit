import {
  CreateBucketCommand,
  CreateBucketCommandInput,
  type S3Client
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

type CreateS3BucketSignedUrlParams = CreateBucketCommandInput & {
  client: S3Client;
  expiresIn?: number;
};

export const createS3BucketSignedUrl = async (
  params: CreateS3BucketSignedUrlParams,
): Promise<string> => {
  const { client, expiresIn = 3600, ...awsOptions } = params;
  const command = new CreateBucketCommand(awsOptions);

  return getSignedUrl(client, command, {
    expiresIn,
  });
};

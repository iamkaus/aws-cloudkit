import {
  type BucketLocationConstraint,
  CreateBucketCommand,
  CreateBucketCommandInput,
  type S3Client,
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

  // us-east-1 is the one region S3 rejects a CreateBucketConfiguration for,
  // so only attach LocationConstraint outside of it — and don't clobber a
  // config the caller passed in explicitly.
  const region = await client.config.region();

  const createBucketConfiguration =
    awsOptions.CreateBucketConfiguration ??
    (region !== 'us-east-1'
      ? { LocationConstraint: region as BucketLocationConstraint }
      : undefined);

  const command = new CreateBucketCommand({
    ...awsOptions,

    // short-circuit evsluation -  if createBucketConfiguration is true then it spreads the values of createBucketConfiguration
    ...(createBucketConfiguration && {
      CreateBucketConfiguration: createBucketConfiguration,
    }),
  });

  return getSignedUrl(client, command, {
    expiresIn,
  });
};
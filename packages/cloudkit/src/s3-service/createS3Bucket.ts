import {
  type BucketLocationConstraint,
  CreateBucketCommand,
  CreateBucketCommandInput,
  type S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

type CreateS3BucketSignedUrlParams = CreateBucketCommandInput & {
  client: S3Client;
  expiresIn: number;
};

const MAX_PRESIGNED_URL_EXPIRATION: number = 3600;

export const createS3BucketSignedUrl = async (
  params: CreateS3BucketSignedUrlParams,
): Promise<string> => {
  const { client, expiresIn, ...awsOptions } = params;

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

  if (expiresIn < 1 || expiresIn > MAX_PRESIGNED_URL_EXPIRATION) {
    throw new RangeError(`expiresIn must be between 1 and ${MAX_PRESIGNED_URL_EXPIRATION} seconds`);
  }

  return getSignedUrl(client, command, {
    expiresIn,
  });
};

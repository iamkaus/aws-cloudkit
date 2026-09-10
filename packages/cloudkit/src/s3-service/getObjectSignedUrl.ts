import {
  GetObjectCommand,
  type GetObjectCommandInput, 
  type S3Client
} from '@aws-sdk/client-s3';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

type S3GetObjectSignedUrlParams = GetObjectCommandInput & {
  client: S3Client;
  expiresIn?: number;
};

export const getObjectSignedUrl = async (params: S3GetObjectSignedUrlParams): Promise<string> => {
  const { client, expiresIn = 3600, ...awsS3Config } = params;
  const command = new GetObjectCommand(awsS3Config);

  return getSignedUrl(client, command, {
    expiresIn,
  });
};

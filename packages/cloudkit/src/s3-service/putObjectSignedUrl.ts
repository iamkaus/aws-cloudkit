import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

type PutObjectSignedUrlParams = PutObjectCommandInput & {
  client: S3Client;
  expiresIn?: number;
};

export const putObjectSignedUrl = async (params: PutObjectSignedUrlParams): Promise<string> => {
  const { client, expiresIn = 3600, ...awsS3Config } = params;
  const command = new PutObjectCommand(awsS3Config);

  return getSignedUrl(client, command, {
    expiresIn: expiresIn,
  });
};

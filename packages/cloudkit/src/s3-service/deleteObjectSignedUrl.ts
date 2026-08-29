import { S3Client, DeleteObjectCommand, type DeleteObjectCommandInput } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

type DeleteObjectSignedUrlParams = DeleteObjectCommandInput & {
  client: S3Client;
  expiresIn?: number;
};

export const deleteObjectSignedUrl = async (
  params: DeleteObjectSignedUrlParams,
  expiresIn = 3600,
): Promise<string> => {
  const { client, ...awsS3Config } = params;
  const command = new DeleteObjectCommand(awsS3Config);

  return getSignedUrl(client, command, {
    expiresIn: expiresIn,
  });
};

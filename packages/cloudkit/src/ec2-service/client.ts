import { EC2Client, type EC2ClientConfig } from '@aws-sdk/client-ec2';

type CreateEC2ClientParams = EC2ClientConfig & {
  accessKey: string;
  secretKey: string;
  accountId?: string;
};

export const createEC2Client = (params: CreateEC2ClientParams): EC2Client => {
  const { accessKey, secretKey, ...awsEC2Config } = params;
  return new EC2Client({
    ...awsEC2Config,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
  });
};

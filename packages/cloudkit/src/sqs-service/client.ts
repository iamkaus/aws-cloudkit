import { SQSClient, type SQSClientConfig } from '@aws-sdk/client-sqs';

type SQSClientParams = SQSClientConfig & {
  accessKey: string;
  secretKey: string;
};

export const createSQSClient = (params: SQSClientParams): SQSClient => {
  const { accessKey, secretKey, ...awsSQSConfig } = params;
  return new SQSClient({
    ...awsSQSConfig,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
  });
};

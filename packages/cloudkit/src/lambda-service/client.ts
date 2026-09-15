import { LambdaClient, LambdaClientConfig } from '@aws-sdk/client-lambda';

type LambdaClientsParams = LambdaClientConfig & {
  accessKey: string;
  secretKey: string;
};

export const createLambdaClient = (params: LambdaClientsParams): LambdaClient => {
  const { accessKey, secretKey, ...awsLambdaConfig } = params;
  return new LambdaClient({
    ...awsLambdaConfig,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
  });
};

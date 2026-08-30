import {
  CreateFunctionCommand,
  LambdaClient,
  type CreateFunctionCommandInput,
  type CreateFunctionCommandOutput,
} from '@aws-sdk/client-lambda';

type CreateLambdaFunctionParams = CreateFunctionCommandInput & {
  client: LambdaClient;
};

export const createLambdaFunction = async (
  params: CreateLambdaFunctionParams,
): Promise<CreateFunctionCommandOutput> => {
  const { client, ...awsLambdaConfig } = params;
  const command = new CreateFunctionCommand(awsLambdaConfig);
  return client.send(command);
};

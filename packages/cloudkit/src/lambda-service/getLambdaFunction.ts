import {
  LambdaClient,
  GetFunctionCommand,
  type GetFunctionCommandInput,
  type GetFunctionCommandOutput,
} from '@aws-sdk/client-lambda';

type GetLambdaFunctionParams = GetFunctionCommandInput & {
  client: LambdaClient;
};

export const getLambdaFunction = async (
  params: GetLambdaFunctionParams,
): Promise<GetFunctionCommandOutput> => {
  const { client, ...awsLambdaConfig } = params;
  const command = new GetFunctionCommand(awsLambdaConfig);
  return client.send(command);
};

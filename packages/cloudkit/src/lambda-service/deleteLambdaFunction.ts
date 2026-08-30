import {
  DeleteFunctionCommand,
  LambdaClient,
  type DeleteFunctionCommandInput,
  type DeleteFunctionCommandOutput,
} from '@aws-sdk/client-lambda';

type DeleteLambdaFunctionParams = DeleteFunctionCommandInput & {
  client: LambdaClient;
};

export const deleteLambdaFunction = async (
  params: DeleteLambdaFunctionParams,
): Promise<DeleteFunctionCommandOutput> => {
  const { client, ...awsLambdaConfig } = params;
  const command = new DeleteFunctionCommand(awsLambdaConfig);
  return client.send(command);
};

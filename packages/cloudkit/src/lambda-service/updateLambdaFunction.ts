import {
  type LambdaClient,
  UpdateFunctionCodeCommand,
  type UpdateFunctionCodeCommandInput,
  type UpdateFunctionCodeCommandOutput,
} from '@aws-sdk/client-lambda';

type UpdateLambdaFunctionParams = UpdateFunctionCodeCommandInput & {
  client: LambdaClient;
};

export const updateLambdaFunction = async (
  params: UpdateLambdaFunctionParams,
): Promise<UpdateFunctionCodeCommandOutput> => {
  const { client, ...awsLambdaConfig } = params;
  const command = new UpdateFunctionCodeCommand(awsLambdaConfig);
  return client.send(command);
};

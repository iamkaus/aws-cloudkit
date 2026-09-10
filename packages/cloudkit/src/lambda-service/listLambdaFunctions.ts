import {
  type LambdaClient,
  ListFunctionsCommand,
  type ListFunctionsCommandInput,
  type ListFunctionsCommandOutput,
} from '@aws-sdk/client-lambda';

type ListLambdaFunctionsParams = ListFunctionsCommandInput & {
  client: LambdaClient;
};

export const listLambdaFunctions = async (
  params: ListLambdaFunctionsParams,
): Promise<ListFunctionsCommandOutput> => {
  const { client, ...awsLambdaConfig } = params;
  const command = new ListFunctionsCommand(awsLambdaConfig);
  return client.send(command);
};

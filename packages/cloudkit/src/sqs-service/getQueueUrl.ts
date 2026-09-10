import {
  type SQSClient,
  GetQueueUrlCommand,
  type GetQueueUrlCommandInput,
  type GetQueueUrlCommandOutput,
} from '@aws-sdk/client-sqs';

type GetSQSQueueUrlParams = GetQueueUrlCommandInput & {
  client: SQSClient;
};

export const getQueueUrl = async (
  params: GetSQSQueueUrlParams,
): Promise<GetQueueUrlCommandOutput> => {
  const { client, ...awsSQSConfig } = params;
  const command = new GetQueueUrlCommand(awsSQSConfig);
  return client.send(command);
};

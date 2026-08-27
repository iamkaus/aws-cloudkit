import {
  SQSClient,
  ListDeadLetterSourceQueuesCommand,
  type ListDeadLetterSourceQueuesCommandInput,
  type ListDeadLetterSourceQueuesCommandOutput,
} from '@aws-sdk/client-sqs';

type ListDeadLetterSourceQueuesParams = ListDeadLetterSourceQueuesCommandInput & {
  client: SQSClient;
};

export const listDeadLetterSourceQueues = async (
  params: ListDeadLetterSourceQueuesParams,
): Promise<ListDeadLetterSourceQueuesCommandOutput> => {
  const { client, ...awsSQSConfig } = params;
  const command = new ListDeadLetterSourceQueuesCommand(awsSQSConfig);
  return client.send(command);
};

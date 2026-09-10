import {
  type SQSClient,
  ListQueuesCommand,
  type ListQueuesCommandInput,
  type ListQueuesCommandOutput,
} from '@aws-sdk/client-sqs';

type ListQueuesParams = ListQueuesCommandInput & {
  client: SQSClient;
};

export const listQueues = async (params: ListQueuesParams): Promise<ListQueuesCommandOutput> => {
  const { client, ...awsSQSConfig } = params;
  const command = new ListQueuesCommand(awsSQSConfig);
  return client.send(command);
};

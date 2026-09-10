import {
  type SQSClient,
  PurgeQueueCommand,
  type PurgeQueueCommandInput,
  type PurgeQueueCommandOutput,
} from '@aws-sdk/client-sqs';

type PurgeQueueParams = PurgeQueueCommandInput & {
  client: SQSClient;
};

export const purgeQueues = async (params: PurgeQueueParams): Promise<PurgeQueueCommandOutput> => {
  const { client, ...awsSQSConfig } = params;
  const command = new PurgeQueueCommand(awsSQSConfig);
  return client.send(command);
};

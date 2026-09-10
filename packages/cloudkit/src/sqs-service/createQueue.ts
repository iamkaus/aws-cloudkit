import {
  type SQSClient,
  CreateQueueCommand,
  type CreateQueueCommandInput,
  type CreateQueueCommandOutput,
} from '@aws-sdk/client-sqs';

type CreateSQSQueueParams = CreateQueueCommandInput & {
  client: SQSClient;
};

export const createSQSQueue = async (
  params: CreateSQSQueueParams,
): Promise<CreateQueueCommandOutput> => {
  const { client, ...awsSQSConfig } = params;
  const command = new CreateQueueCommand(awsSQSConfig);
  return client.send(command);
};

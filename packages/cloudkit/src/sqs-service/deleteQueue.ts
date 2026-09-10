import {
  type SQSClient,
  DeleteQueueCommand,
  type DeleteQueueCommandInput,
  type DeleteQueueCommandOutput,
} from '@aws-sdk/client-sqs';

type DeleteSQSQueueParams = DeleteQueueCommandInput & {
  client: SQSClient;
};

export const deleteSQSQueue = async (
  params: DeleteSQSQueueParams,
): Promise<DeleteQueueCommandOutput> => {
  const { client, ...awsSQSConfig } = params;
  const command = new DeleteQueueCommand(awsSQSConfig);
  return client.send(command);
};

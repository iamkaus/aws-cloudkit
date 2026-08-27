import {
  SQSClient,
  DeleteMessageBatchCommand,
  type DeleteMessageBatchCommandInput,
  type DeleteMessageBatchCommandOutput,
} from '@aws-sdk/client-sqs';

type DeleteMessageBatchParams = DeleteMessageBatchCommandInput & {
  client: SQSClient;
};

export const deleteMessageBatch = async (
  params: DeleteMessageBatchParams,
): Promise<DeleteMessageBatchCommandOutput> => {
  const { client, ...awsSQSConfig } = params;
  const command = new DeleteMessageBatchCommand(awsSQSConfig);
  return client.send(command);
};

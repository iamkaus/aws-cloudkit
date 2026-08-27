import {
  SQSClient,
  SendMessageBatchCommand,
  type SendMessageBatchCommandInput,
  type SendMessageBatchCommandOutput,
} from '@aws-sdk/client-sqs';

type SendMessageBatchParams = SendMessageBatchCommandInput & {
  client: SQSClient;
};

export const sendMessageBatch = async (
  params: SendMessageBatchParams,
): Promise<SendMessageBatchCommandOutput> => {
  const { client, ...awsSQSConfig } = params;
  const command = new SendMessageBatchCommand(awsSQSConfig);
  return client.send(command);
};

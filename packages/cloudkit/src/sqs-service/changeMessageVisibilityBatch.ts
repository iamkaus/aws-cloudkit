import {
  SQSClient,
  ChangeMessageVisibilityBatchCommand,
  type ChangeMessageVisibilityBatchCommandInput,
  type ChangeMessageVisibilityBatchCommandOutput,
} from '@aws-sdk/client-sqs';

type ChangeMessageVisibilityBatchParams = ChangeMessageVisibilityBatchCommandInput & {
  client: SQSClient;
};

export const changeMessageVisibilityBatch = async (
  params: ChangeMessageVisibilityBatchParams,
): Promise<ChangeMessageVisibilityBatchCommandOutput> => {
  const { client, ...awsSQSConfig } = params;

  const command = new ChangeMessageVisibilityBatchCommand(awsSQSConfig);

  return client.send(command);
};

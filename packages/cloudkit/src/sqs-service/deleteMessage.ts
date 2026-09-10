import {
  type SQSClient,
  DeleteMessageCommand,
  type DeleteMessageCommandInput,
  type DeleteMessageCommandOutput,
} from '@aws-sdk/client-sqs';

type DeleteMessageParams = DeleteMessageCommandInput & {
  client: SQSClient;
};

export const deleteMessage = async (
  params: DeleteMessageParams,
): Promise<DeleteMessageCommandOutput> => {
  const { client, ...awsSQSConfig } = params;

  const command = new DeleteMessageCommand(awsSQSConfig);

  return client.send(command);
};

import {
  type SQSClient,
  ReceiveMessageCommand,
  type ReceiveMessageCommandInput,
  type ReceiveMessageCommandOutput,
} from '@aws-sdk/client-sqs';

type ReceiveMessageCommandParams = ReceiveMessageCommandInput & {
  client: SQSClient;
};

export const receiveMessage = async (
  params: ReceiveMessageCommandParams,
): Promise<ReceiveMessageCommandOutput> => {
  const { client, ...awsSQSConfig } = params;
  const command = new ReceiveMessageCommand(awsSQSConfig);
  return client.send(command);
};

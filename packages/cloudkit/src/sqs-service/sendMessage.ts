import {
  SQSClient,
  SendMessageCommand,
  type SendMessageCommandInput,
  type SendMessageCommandOutput,
} from '@aws-sdk/client-sqs';

type SendMessageParams = SendMessageCommandInput & {
  client: SQSClient;
};

export const sendMessage = async (params: SendMessageParams): Promise<SendMessageCommandOutput> => {
  const { client, ...awsSQSConfig } = params;

  const command = new SendMessageCommand(awsSQSConfig);
  return client.send(command);
};

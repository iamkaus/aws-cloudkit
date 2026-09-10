import {
  type SQSClient,
  ChangeMessageVisibilityCommand,
  type ChangeMessageVisibilityCommandInput,
  type ChangeMessageVisibilityCommandOutput,
} from '@aws-sdk/client-sqs';

type ChangeMessageVisibilityParams = ChangeMessageVisibilityCommandInput & {
  client: SQSClient;
};

export const changeMessageVisibility = async (
  params: ChangeMessageVisibilityParams,
): Promise<ChangeMessageVisibilityCommandOutput> => {
  const { client, ...awsSQSConfig } = params;

  const command = new ChangeMessageVisibilityCommand(awsSQSConfig);

  return client.send(command);
};

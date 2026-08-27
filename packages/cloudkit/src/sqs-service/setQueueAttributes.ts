import {
  SQSClient,
  SetQueueAttributesCommand,
  type SetQueueAttributesCommandInput,
  type SetQueueAttributesCommandOutput,
} from '@aws-sdk/client-sqs';

type SetSQSQueueAttributesParams = SetQueueAttributesCommandInput & {
  client: SQSClient;
};

export const setQueueAttributes = async (
  params: SetSQSQueueAttributesParams,
): Promise<SetQueueAttributesCommandOutput> => {
  const { client, ...awsSQSConfig } = params;
  const command = new SetQueueAttributesCommand(awsSQSConfig);
  return client.send(command);
};

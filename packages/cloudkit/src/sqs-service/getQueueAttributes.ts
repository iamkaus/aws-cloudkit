import {
  type SQSClient,
  GetQueueAttributesCommand,
  type GetQueueAttributesCommandInput,
  type GetQueueAttributesCommandOutput,
} from '@aws-sdk/client-sqs';

type GetSQSQueueAttributesParams = GetQueueAttributesCommandInput & {
  client: SQSClient;
};

export const getQueueAttributes = async (
  params: GetSQSQueueAttributesParams,
): Promise<GetQueueAttributesCommandOutput> => {
  const { client, ...awsSQSConfig } = params;
  const command = new GetQueueAttributesCommand(awsSQSConfig);
  return client.send(command);
};

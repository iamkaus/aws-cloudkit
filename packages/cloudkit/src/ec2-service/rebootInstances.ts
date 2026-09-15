import {
  type EC2Client,
  RebootInstancesCommand,
  type RebootInstancesCommandInput,
  type RebootInstancesCommandOutput,
} from '@aws-sdk/client-ec2';

type RebootInstancesParams = RebootInstancesCommandInput & {
  client: EC2Client;
};

export const rebootInstances = async (
  params: RebootInstancesParams,
): Promise<RebootInstancesCommandOutput> => {
  const { client, ...awsEC2Config } = params;

  const command = new RebootInstancesCommand(awsEC2Config);

  return client.send(command);
};

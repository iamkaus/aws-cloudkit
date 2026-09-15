import {
  type EC2Client,
  TerminateInstancesCommand,
  type TerminateInstancesCommandInput,
  type TerminateInstancesCommandOutput,
} from '@aws-sdk/client-ec2';

type TerminateInstancesParams = TerminateInstancesCommandInput & {
  client: EC2Client;
};

export const terminateInstances = async (
  params: TerminateInstancesParams,
): Promise<TerminateInstancesCommandOutput> => {
  const { client, ...awsEC2Config } = params;

  const command = new TerminateInstancesCommand(awsEC2Config);

  return client.send(command);
};

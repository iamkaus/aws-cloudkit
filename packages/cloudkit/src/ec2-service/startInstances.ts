import {
  type EC2Client,
  StartInstancesCommand,
  type StartInstancesCommandInput,
  type StartInstancesCommandOutput,
} from '@aws-sdk/client-ec2';

type StartInstancesParams = StartInstancesCommandInput & {
  client: EC2Client;
};

export const startInstances = async (
  params: StartInstancesParams,
): Promise<StartInstancesCommandOutput> => {
  const { client, ...awsEC2Config } = params;

  const command = new StartInstancesCommand(awsEC2Config);

  return client.send(command);
};

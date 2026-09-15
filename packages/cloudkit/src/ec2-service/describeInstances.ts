import {
  DescribeInstancesCommand,
  type EC2Client,
  type DescribeInstancesCommandInput,
  type DescribeInstancesCommandOutput,
} from '@aws-sdk/client-ec2';

type DescribeInstancesParams = DescribeInstancesCommandInput & {
  client: EC2Client;
};

export const describeInstances = async (
  params: DescribeInstancesParams,
): Promise<DescribeInstancesCommandOutput> => {
  const { client, ...awsEC2Config } = params;

  const command = new DescribeInstancesCommand(awsEC2Config);

  return client.send(command);
};

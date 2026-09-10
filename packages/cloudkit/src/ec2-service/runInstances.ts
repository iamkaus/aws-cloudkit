import {
    type EC2Client,
    RunInstancesCommand,
    type RunInstancesCommandInput,
    type RunInstancesCommandOutput,
} from '@aws-sdk/client-ec2';

type RunInstancesParams = RunInstancesCommandInput & {
    client: EC2Client;
};

export const runInstances = async (
    params: RunInstancesParams,
): Promise<RunInstancesCommandOutput> => {
    const { client, ...awsEC2Config } = params;

    const command = new RunInstancesCommand(awsEC2Config);

    return client.send(command);
};
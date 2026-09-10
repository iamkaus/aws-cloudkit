import {
    type EC2Client,
    StopInstancesCommand,
    type StopInstancesCommandInput,
    type StopInstancesCommandOutput,
} from '@aws-sdk/client-ec2';

type StopInstancesParams = StopInstancesCommandInput & {
    client: EC2Client;
};

export const stopInstances = async (
    params: StopInstancesParams,
): Promise<StopInstancesCommandOutput> => {
    const { client, ...awsEC2Config } = params;

    const command = new StopInstancesCommand(awsEC2Config);

    return client.send(command);
};
import {
    describe,
    expect,
    it,
    vi,
} from 'vitest';

import {
    DescribeInstancesCommand,
    EC2Client,
} from '@aws-sdk/client-ec2';

import { describeInstances } from '../../../src/ec2-service/describeInstances.js';

describe('describeInstances', () => {
    it('sends a DescribeInstancesCommand with the provided parameters', async () => {
        const send = vi.fn().mockResolvedValue({
            Reservations: [
                {
                    Instances: [
                        {
                            InstanceId: 'i-123456789',
                            InstanceType: 't3.micro',
                        },
                    ],
                },
            ],
        });

        const client = {
            send,
        } as unknown as EC2Client;

        const response = await describeInstances({
            client,
            InstanceIds: ['i-123456789'],
        });

        expect(response).toEqual({
            Reservations: [
                {
                    Instances: [
                        {
                            InstanceId: 'i-123456789',
                            InstanceType: 't3.micro',
                        },
                    ],
                },
            ],
        });

        expect(send).toHaveBeenCalledOnce();

        expect(send).toHaveBeenCalledWith(
            expect.any(DescribeInstancesCommand),
        );

        const command = send.mock.calls[0]![0];

        expect(command.input).toEqual({
            InstanceIds: ['i-123456789'],
        });
    });
});
import {
    describe,
    expect,
    it,
    vi,
} from 'vitest';

import {
    EC2Client,
    StopInstancesCommand,
} from '@aws-sdk/client-ec2';

import { stopInstances } from '../../../src/ec2-service/stopInstances.js';

describe('stopInstances', () => {
    it('sends a StopInstancesCommand with the provided parameters', async () => {
        const send = vi.fn().mockResolvedValue({
            StoppingInstances: [
                {
                    InstanceId: 'i-123456789',
                    CurrentState: {
                        Name: 'stopping',
                    },
                    PreviousState: {
                        Name: 'running',
                    },
                },
            ],
        });

        const client = {
            send,
        } as unknown as EC2Client;

        const response = await stopInstances({
            client,
            InstanceIds: ['i-123456789'],
        });

        expect(response).toEqual({
            StoppingInstances: [
                {
                    InstanceId: 'i-123456789',
                    CurrentState: {
                        Name: 'stopping',
                    },
                    PreviousState: {
                        Name: 'running',
                    },
                },
            ],
        });

        expect(send).toHaveBeenCalledOnce();

        expect(send).toHaveBeenCalledWith(
            expect.any(StopInstancesCommand),
        );

        const command = send.mock.calls[0]![0];

        expect(command.input).toEqual({
            InstanceIds: ['i-123456789'],
        });
    });
});
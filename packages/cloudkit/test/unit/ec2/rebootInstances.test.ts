import {
    describe,
    expect,
    it,
    vi,
} from 'vitest';

import {
    EC2Client,
    RebootInstancesCommand,
} from '@aws-sdk/client-ec2';

import { rebootInstances } from '../../../src/ec2-service/rebootInstances.js';

describe('rebootInstances', () => {
    it('sends a RebootInstancesCommand with the provided parameters', async () => {
        const send = vi.fn().mockResolvedValue({});

        const client = {
            send,
        } as unknown as EC2Client;

        const response = await rebootInstances({
            client,
            InstanceIds: ['i-123456789'],
        });

        expect(response).toEqual({});

        expect(send).toHaveBeenCalledOnce();

        expect(send).toHaveBeenCalledWith(
            expect.any(RebootInstancesCommand),
        );

        const command = send.mock.calls[0]![0];

        expect(command.input).toEqual({
            InstanceIds: ['i-123456789'],
        });
    });
});
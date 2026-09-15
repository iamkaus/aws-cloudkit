import { describe, expect, it, vi } from 'vitest';

import { EC2Client, StartInstancesCommand } from '@aws-sdk/client-ec2';

import { startInstances } from '../../../src/ec2-service/startInstances.js';

describe('startInstances', () => {
  it('sends a StartInstancesCommand with the provided parameters', async () => {
    const send = vi.fn().mockResolvedValue({
      StartingInstances: [
        {
          InstanceId: 'i-123456789',
          CurrentState: {
            Name: 'pending',
          },
          PreviousState: {
            Name: 'stopped',
          },
        },
      ],
    });

    const client = {
      send,
    } as unknown as EC2Client;

    const response = await startInstances({
      client,
      InstanceIds: ['i-123456789'],
    });

    expect(response).toEqual({
      StartingInstances: [
        {
          InstanceId: 'i-123456789',
          CurrentState: {
            Name: 'pending',
          },
          PreviousState: {
            Name: 'stopped',
          },
        },
      ],
    });

    expect(send).toHaveBeenCalledOnce();

    expect(send).toHaveBeenCalledWith(expect.any(StartInstancesCommand));

    const command = send.mock.calls[0]![0];

    expect(command.input).toEqual({
      InstanceIds: ['i-123456789'],
    });
  });
});

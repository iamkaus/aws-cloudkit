import { describe, expect, it, vi } from 'vitest';

import { EC2Client, RunInstancesCommand } from '@aws-sdk/client-ec2';

import { runInstances } from '../../../src/ec2-service/runInstances.js';

describe('runInstances', () => {
  it('sends a RunInstancesCommand with the provided parameters', async () => {
    const send = vi.fn().mockResolvedValue({
      Instances: [
        {
          InstanceId: 'i-123456789',
        },
      ],
    });

    const client = {
      send,
    } as unknown as EC2Client;

    const response = await runInstances({
      client,
      ImageId: 'ami-123456',
      InstanceType: 't3.micro',
      MinCount: 1,
      MaxCount: 1,
    });

    expect(response).toEqual({
      Instances: [
        {
          InstanceId: 'i-123456789',
        },
      ],
    });

    expect(send).toHaveBeenCalledOnce();

    expect(send).toHaveBeenCalledWith(expect.any(RunInstancesCommand));

    const command = send.mock.calls[0]![0];

    expect(command.input).toEqual({
      ImageId: 'ami-123456',
      InstanceType: 't3.micro',
      MinCount: 1,
      MaxCount: 1,
    });
  });
});

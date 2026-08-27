import { describe, expect, it, vi } from 'vitest';
import { PurgeQueueCommand, SQSClient } from '@aws-sdk/client-sqs';

import { purgeQueues } from '../../../src/sqs-service/purgeQueue.js';

describe('purgeQueue', () => {
  it('sends a PurgeQueueCommand with the provided parameters', async () => {
    const send = vi.fn().mockResolvedValue({});

    const client = {
      send,
    } as unknown as SQSClient;

    const response = await purgeQueues({
      client,
      QueueUrl: 'https://example.com/my-queue',
    });

    expect(send).toHaveBeenCalledOnce();

    expect(response).toEqual({});

    expect(send).toHaveBeenCalledWith(expect.any(PurgeQueueCommand));

    const command = send.mock.calls[0]![0];

    expect(command.input).toEqual({
      QueueUrl: 'https://example.com/my-queue',
    });
  });
});

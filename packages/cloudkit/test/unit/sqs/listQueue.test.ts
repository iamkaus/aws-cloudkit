import { describe, expect, it, vi } from 'vitest';
import { ListQueuesCommand, SQSClient } from '@aws-sdk/client-sqs';

import { listQueues } from '../../../src/sqs-service/listQueue.js';

describe('listQueues', () => {
  it('sends a ListQueuesCommand with the provided parameters', async () => {
    const send = vi.fn().mockResolvedValue({
      QueueUrls: ['https://example.com/queue-1', 'https://example.com/queue-2'],
    });

    const client = {
      send,
    } as unknown as SQSClient;

    const response = await listQueues({
      client,
      QueueNamePrefix: 'test-',
      MaxResults: 10,
    });

    expect(send).toHaveBeenCalledOnce();

    expect(response.QueueUrls).toEqual([
      'https://example.com/queue-1',
      'https://example.com/queue-2',
    ]);

    expect(send).toHaveBeenCalledWith(expect.any(ListQueuesCommand));

    const command = send.mock.calls[0]![0];

    expect(command.input).toEqual({
      QueueNamePrefix: 'test-',
      MaxResults: 10,
    });
  });
});

import { describe, expect, it, vi } from 'vitest';
import { ListDeadLetterSourceQueuesCommand, SQSClient } from '@aws-sdk/client-sqs';

import { listDeadLetterSourceQueues } from '../../../src/sqs-service/listDeadLetterSourceQueue.js';

describe('listSqsDeadLetterSourceQueues', () => {
  it('sends a ListDeadLetterSourceQueuesCommand with the provided parameters', async () => {
    const send = vi.fn().mockResolvedValue({
      queueUrls: ['https://example.com/source-queue-1', 'https://example.com/source-queue-2'],
    });

    const client = {
      send,
    } as unknown as SQSClient;

    const response = await listDeadLetterSourceQueues({
      client,
      QueueUrl: 'https://example.com/dlq',
    });

    expect(send).toHaveBeenCalledOnce();

    expect(response.queueUrls).toEqual([
      'https://example.com/source-queue-1',
      'https://example.com/source-queue-2',
    ]);

    expect(send).toHaveBeenCalledWith(expect.any(ListDeadLetterSourceQueuesCommand));

    const command = send.mock.calls[0]![0];

    expect(command.input).toEqual({
      QueueUrl: 'https://example.com/dlq',
    });
  });
});

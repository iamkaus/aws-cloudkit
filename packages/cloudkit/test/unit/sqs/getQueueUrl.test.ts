import { describe, expect, it, vi } from 'vitest';
import { GetQueueUrlCommand, SQSClient } from '@aws-sdk/client-sqs';

import { getQueueUrl } from '../../../src/sqs-service/getQueueUrl.js';

describe('getSQSQueueUrl', () => {
  it('sends a GetQueueUrlCommand with the provided parameters', async () => {
    const send = vi.fn().mockResolvedValue({
      QueueUrl: 'https://example.com/my-queue',
    });

    const client = {
      send,
    } as unknown as SQSClient;

    const response = await getQueueUrl({
      client,
      QueueName: 'my-queue',
    });

    expect(send).toHaveBeenCalledOnce();

    expect(response.QueueUrl).toBe('https://example.com/my-queue');

    expect(send).toHaveBeenCalledWith(expect.any(GetQueueUrlCommand));

    const command = send.mock.calls[0]![0];

    expect(command.input).toEqual({
      QueueName: 'my-queue',
    });
  });
});

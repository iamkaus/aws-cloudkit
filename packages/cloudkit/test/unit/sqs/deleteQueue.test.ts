import { describe, expect, it, vi } from 'vitest';
import { DeleteQueueCommand, SQSClient } from '@aws-sdk/client-sqs';
import { deleteSQSQueue } from '../../../src/index.js';

describe('DeleteSQSQueue', () => {
  it('it sends a DeleteQueueCommand with the provided parameter', async () => {
    const send = vi.fn().mockResolvedValue({});
    const client = {
      send,
    } as unknown as SQSClient;

    const response = await deleteSQSQueue({
      client,
      QueueUrl: 'https://example.com/my-queue',
    });

    expect(send).toHaveBeenCalledOnce();
    expect(response).toEqual({});
    expect(send).toHaveBeenCalledWith(expect.any(DeleteQueueCommand));

    const command = send.mock.calls[0]![0];

    expect(command.input).toEqual({
      QueueUrl: 'https://example.com/my-queue',
    });
  });
});

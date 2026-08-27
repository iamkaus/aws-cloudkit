import { vi, describe, it, expect } from 'vitest';
import { CreateQueueCommand, SQSClient } from '@aws-sdk/client-sqs';
import { createSQSQueue } from '../../../src/index.js';

describe('createSQSQueue', () => {
  it('sends a CreateQueueCommand with the provided parameters', async () => {
    const send = vi.fn().mockResolvedValue({
      QueueUrl: 'https://example.com/my-queue',
    });

    const client = {
      send,
    } as unknown as SQSClient;

    const response = await createSQSQueue({
      client,
      QueueName: 'my-queue',
      Attributes: {
        VisibilityTimeout: '60',
      },
    });

    expect(send).toHaveBeenCalledOnce();
    expect(response.QueueUrl).toBe('https://example.com/my-queue');
    expect(send).toHaveBeenCalledWith(expect.any(CreateQueueCommand));

    const command = send.mock.calls[0]![0];

    expect(command.input).toEqual({
      QueueName: 'my-queue',
      Attributes: {
        VisibilityTimeout: '60',
      },
    });
  });
});

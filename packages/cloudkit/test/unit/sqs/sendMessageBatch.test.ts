import { describe, expect, it, vi } from 'vitest';
import { SendMessageBatchCommand, SQSClient } from '@aws-sdk/client-sqs';

import { sendMessageBatch } from '../../../src/sqs-service/sendMessageBatch.js';

describe('sendMessageBatch', () => {
  it('sends a SendMessageBatchCommand with the provided parameters', async () => {
    const send = vi.fn().mockResolvedValue({
      Successful: [
        {
          Id: '1',
          MessageId: 'test-message-id-1',
        },
        {
          Id: '2',
          MessageId: 'test-message-id-2',
        },
      ],
      Failed: [],
    });

    const client = {
      send,
    } as unknown as SQSClient;

    const response = await sendMessageBatch({
      client,
      QueueUrl: 'https://example.com/queue',
      Entries: [
        {
          Id: '1',
          MessageBody: 'Message 1',
        },
        {
          Id: '2',
          MessageBody: 'Message 2',
        },
      ],
    });

    expect(send).toHaveBeenCalledOnce();

    expect(response.Successful).toHaveLength(2);
    expect(response.Failed).toHaveLength(0);

    expect(send).toHaveBeenCalledWith(expect.any(SendMessageBatchCommand));

    const command = send.mock.calls[0]![0];

    expect(command.input).toEqual({
      QueueUrl: 'https://example.com/queue',
      Entries: [
        {
          Id: '1',
          MessageBody: 'Message 1',
        },
        {
          Id: '2',
          MessageBody: 'Message 2',
        },
      ],
    });
  });
});

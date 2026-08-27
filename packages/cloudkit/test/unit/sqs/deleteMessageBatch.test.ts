import { describe, expect, it, vi } from 'vitest';
import { DeleteMessageBatchCommand, SQSClient } from '@aws-sdk/client-sqs';

import { deleteMessageBatch } from '../../../src/sqs-service/deleteMessageBatch.js';

describe('deleteMessageBatch', () => {
  it('sends a DeleteMessageBatchCommand with the provided parameters', async () => {
    const send = vi.fn().mockResolvedValue({
      Successful: [
        {
          Id: '1',
        },
        {
          Id: '2',
        },
      ],
      Failed: [],
    });

    const client = {
      send,
    } as unknown as SQSClient;

    const response = await deleteMessageBatch({
      client,
      QueueUrl: 'https://example.com/queue',
      Entries: [
        {
          Id: '1',
          ReceiptHandle: 'receipt-handle-1',
        },
        {
          Id: '2',
          ReceiptHandle: 'receipt-handle-2',
        },
      ],
    });

    expect(send).toHaveBeenCalledOnce();

    expect(response.Successful).toHaveLength(2);
    expect(response.Failed).toHaveLength(0);

    expect(send).toHaveBeenCalledWith(expect.any(DeleteMessageBatchCommand));

    const command = send.mock.calls[0]![0];

    expect(command.input).toEqual({
      QueueUrl: 'https://example.com/queue',
      Entries: [
        {
          Id: '1',
          ReceiptHandle: 'receipt-handle-1',
        },
        {
          Id: '2',
          ReceiptHandle: 'receipt-handle-2',
        },
      ],
    });
  });
});

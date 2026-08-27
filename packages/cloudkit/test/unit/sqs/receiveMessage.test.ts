import { describe, expect, it, vi } from 'vitest';
import { ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

import { receiveMessage } from '../../../src/sqs-service/receiveMessage.js';

describe('receiveMessage', () => {
  it('sends a ReceiveMessageCommand with the provided parameters', async () => {
    const send = vi.fn().mockResolvedValue({
      Messages: [
        {
          MessageId: 'test-message-id',
          Body: 'Hello CloudKit',
        },
      ],
    });

    const client = {
      send,
    } as unknown as SQSClient;

    const response = await receiveMessage({
      client,
      QueueUrl: 'https://example.com/queue',
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20,
    });

    expect(send).toHaveBeenCalledOnce();

    expect(response.Messages).toHaveLength(1);

    expect(send).toHaveBeenCalledWith(expect.any(ReceiveMessageCommand));

    const command = send.mock.calls[0]![0];

    expect(command.input).toEqual({
      QueueUrl: 'https://example.com/queue',
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20,
    });
  });
});

import { describe, expect, it, vi } from 'vitest';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

import { sendMessage } from '../../../src/sqs-service/sendMessage.js';

describe('sendMessage', () => {
  it('sends a SendMessageCommand with the provided parameters', async () => {
    const send = vi.fn().mockResolvedValue({
      MessageId: 'test-message-id',
    });

    const client = {
      send,
    } as unknown as SQSClient;

    const response = await sendMessage({
      client,
      QueueUrl: 'https://example.com/queue',
      MessageBody: 'Hello CloudKit',
    });

    expect(send).toHaveBeenCalledOnce();

    expect(response.MessageId).toBe('test-message-id');

    expect(send).toHaveBeenCalledWith(expect.any(SendMessageCommand));

    const command = send.mock.calls[0]![0];

    expect(command.input).toEqual({
      QueueUrl: 'https://example.com/queue',
      MessageBody: 'Hello CloudKit',
    });
  });
});

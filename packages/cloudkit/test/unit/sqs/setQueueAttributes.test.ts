import { describe, expect, it, vi } from 'vitest';
import { SetQueueAttributesCommand, SQSClient } from '@aws-sdk/client-sqs';

import { setQueueAttributes } from '../../../src/sqs-service/setQueueAttributes.js';

describe('setQueueAttributes', () => {
  it('sends a SetQueueAttributesCommand with the provided parameters', async () => {
    const send = vi.fn().mockResolvedValue({});

    const client = {
      send,
    } as unknown as SQSClient;

    const response = await setQueueAttributes({
      client,
      QueueUrl: 'https://example.com/my-queue',
      Attributes: {
        VisibilityTimeout: '120',
        ReceiveMessageWaitTimeSeconds: '20',
      },
    });

    expect(send).toHaveBeenCalledOnce();

    expect(response).toEqual({});

    expect(send).toHaveBeenCalledWith(expect.any(SetQueueAttributesCommand));

    const command = send.mock.calls[0]![0];

    expect(command.input).toEqual({
      QueueUrl: 'https://example.com/my-queue',
      Attributes: {
        VisibilityTimeout: '120',
        ReceiveMessageWaitTimeSeconds: '20',
      },
    });
  });
});

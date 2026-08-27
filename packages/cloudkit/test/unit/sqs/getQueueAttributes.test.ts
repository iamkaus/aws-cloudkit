import { describe, expect, it, vi } from 'vitest';
import { GetQueueAttributesCommand, SQSClient } from '@aws-sdk/client-sqs';

import { getQueueAttributes } from '../../../src/sqs-service/getQueueAttributes.js';

describe('getQueueAttributes', () => {
  it('sends a GetQueueAttributesCommand with the provided parameters', async () => {
    const send = vi.fn().mockResolvedValue({
      Attributes: {
        ApproximateNumberOfMessages: '10',
        VisibilityTimeout: '30',
      },
    });

    const client = {
      send,
    } as unknown as SQSClient;

    const response = await getQueueAttributes({
      client,
      QueueUrl: 'https://example.com/my-queue',
      AttributeNames: ['ApproximateNumberOfMessages', 'VisibilityTimeout'],
    });

    expect(send).toHaveBeenCalledOnce();

    expect(response.Attributes).toEqual({
      ApproximateNumberOfMessages: '10',
      VisibilityTimeout: '30',
    });

    expect(send).toHaveBeenCalledWith(expect.any(GetQueueAttributesCommand));

    const command = send.mock.calls[0]![0];

    expect(command.input).toEqual({
      QueueUrl: 'https://example.com/my-queue',
      AttributeNames: ['ApproximateNumberOfMessages', 'VisibilityTimeout'],
    });
  });
});

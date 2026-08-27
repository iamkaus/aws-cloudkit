import { describe, expect, it, vi } from 'vitest';
import {
    ChangeMessageVisibilityCommand,
    SQSClient,
} from '@aws-sdk/client-sqs';

import { changeMessageVisibility } from '../../../src/sqs-service/changeMessageVisibility.js';

describe('changeMessageVisibility', () => {
    it('sends a ChangeMessageVisibilityCommand with the provided parameters', async () => {
        const send = vi.fn().mockResolvedValue({});

        const client = {
            send,
        } as unknown as SQSClient;

        const response = await changeMessageVisibility({
            client,
            QueueUrl: 'https://example.com/queue',
            ReceiptHandle: 'test-receipt-handle',
            VisibilityTimeout: 120,
        });

        expect(send).toHaveBeenCalledOnce();
        expect(response).toEqual({});

        expect(send).toHaveBeenCalledWith(
            expect.any(ChangeMessageVisibilityCommand),
        );

        const command = send.mock.calls[0]![0];

        expect(command.input).toEqual({
            QueueUrl: 'https://example.com/queue',
            ReceiptHandle: 'test-receipt-handle',
            VisibilityTimeout: 120,
        });
    });
});
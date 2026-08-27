import { describe, expect, it, vi } from 'vitest';
import {
    DeleteMessageCommand,
    SQSClient,
} from '@aws-sdk/client-sqs';

import { deleteMessage } from '../../../src/sqs-service/deleteMessage.js';

describe('deleteMessage', () => {
    it('sends a DeleteMessageCommand with the provided parameters', async () => {
        const send = vi.fn().mockResolvedValue({});

        const client = {
            send,
        } as unknown as SQSClient;

        const response = await deleteMessage({
            client,
            QueueUrl: 'https://example.com/queue',
            ReceiptHandle: 'test-receipt-handle',
        });

        expect(send).toHaveBeenCalledOnce();
        expect(response).toEqual({});

        expect(send).toHaveBeenCalledWith(
            expect.any(DeleteMessageCommand),
        );

        const command = send.mock.calls[0]![0];

        expect(command.input).toEqual({
            QueueUrl: 'https://example.com/queue',
            ReceiptHandle: 'test-receipt-handle',
        });
    });
});
import { describe, expect, it, vi } from 'vitest';
import {
    ChangeMessageVisibilityBatchCommand,
    SQSClient,
} from '@aws-sdk/client-sqs';

import { changeMessageVisibilityBatch } from '../../../src/sqs-service/changeMessageVisibilityBatch.js';

describe('changeMessageVisibilityBatch', () => {
    it('sends a ChangeMessageVisibilityBatchCommand with the provided parameters', async () => {
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

        const response = await changeMessageVisibilityBatch({
            client,
            QueueUrl: 'https://example.com/queue',
            Entries: [
                {
                    Id: '1',
                    ReceiptHandle: 'receipt-handle-1',
                    VisibilityTimeout: 120,
                },
                {
                    Id: '2',
                    ReceiptHandle: 'receipt-handle-2',
                    VisibilityTimeout: 180,
                },
            ],
        });

        expect(send).toHaveBeenCalledOnce();

        expect(response.Successful).toHaveLength(2);
        expect(response.Failed).toHaveLength(0);

        expect(send).toHaveBeenCalledWith(
            expect.any(ChangeMessageVisibilityBatchCommand),
        );

        const command = send.mock.calls[0]![0];

        expect(command.input).toEqual({
            QueueUrl: 'https://example.com/queue',
            Entries: [
                {
                    Id: '1',
                    ReceiptHandle: 'receipt-handle-1',
                    VisibilityTimeout: 120,
                },
                {
                    Id: '2',
                    ReceiptHandle: 'receipt-handle-2',
                    VisibilityTimeout: 180,
                },
            ],
        });
    });
});
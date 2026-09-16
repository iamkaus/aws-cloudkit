import {
    afterAll,
    beforeAll,
    describe,
    expect,
    it,
} from 'vitest';

import {
    createSQSClient,
} from '../../../src/sqs-service/client.js';

import {
    createSQSQueue,
} from '../../../src/sqs-service/createQueue.js';

import {
    getQueueUrl,
} from '../../../src/sqs-service/getQueueUrl.js';

import {
    sendMessage,
} from '../../../src/sqs-service/sendMessage.js';

import {
    receiveMessage,
} from '../../../src/sqs-service/receiveMessage.js';

import {
    deleteMessage,
} from '../../../src/sqs-service/deleteMessage.js';

import {
    deleteMessageBatch,
} from '../../../src/sqs-service/deleteMessageBatch.js';

import {
    sendMessageBatch,
} from '../../../src/sqs-service/sendMessageBatch.js';

import {
    changeMessageVisibility,
} from '../../../src/sqs-service/changeMessageVisibility.js';

import {
    purgeQueues,
} from '../../../src/sqs-service/purgeQueue.js';

import {
    deleteSQSQueue,
} from '../../../src/sqs-service/deleteQueue.js';

import {
    AWS_REGION,
    AWS_USER_ACCESS_KEY,
    AWS_USER_SECRET_KEY,
} from '../../../config/env.config.js';

describe('SQS integration', () => {
    const client = createSQSClient({
        region: AWS_REGION,
        accessKey: AWS_USER_ACCESS_KEY,
        secretKey: AWS_USER_SECRET_KEY
    });

    const queueName = `cloudkit-integration-${Date.now()}`;

    let queueUrl: string;

    beforeAll(
        async () => {
            const createResponse = await createSQSQueue({
                client,
                QueueName: queueName,
            });

            expect(createResponse.QueueUrl).toBeDefined();

            const urlResponse = await getQueueUrl({
                client,
                QueueName: queueName,
            });

            expect(urlResponse.QueueUrl).toBeDefined();

            queueUrl = urlResponse.QueueUrl!;
        },
        30_000,
    );

    afterAll(
        async () => {
            if (!queueUrl) return;

            try {
                await deleteSQSQueue({
                    client,
                    QueueUrl: queueUrl,
                });
            } catch {
                // Ignore cleanup errors.
            }
        },
        30_000,
    );

    it(
        'sends, receives, changes visibility, and deletes a message',
        async () => {
            // -----------------------------
            // SEND MESSAGE
            // -----------------------------

            const sendResponse = await sendMessage({
                client,
                QueueUrl: queueUrl,
                MessageBody: 'CloudKit SQS integration test',
            });

            expect(sendResponse.MessageId).toBeDefined();
            expect(sendResponse.MessageId).toBeTypeOf('string');

            // -----------------------------
            // RECEIVE MESSAGE
            // -----------------------------

            const receiveResponse = await receiveMessage({
                client,
                QueueUrl: queueUrl,
                MaxNumberOfMessages: 1,
                WaitTimeSeconds: 10,
            });

            expect(receiveResponse.Messages).toBeDefined();
            expect(receiveResponse.Messages).toHaveLength(1);

            const message = receiveResponse.Messages?.[0];

            expect(message?.MessageId).toBe(
                sendResponse.MessageId,
            );

            expect(message?.Body).toBe(
                'CloudKit SQS integration test',
            );

            expect(message?.ReceiptHandle).toBeDefined();

            const receiptHandle = message!.ReceiptHandle!;

            // -----------------------------
            // CHANGE VISIBILITY
            // -----------------------------

            const visibilityResponse =
                await changeMessageVisibility({
                    client,
                    QueueUrl: queueUrl,
                    ReceiptHandle: receiptHandle,
                    VisibilityTimeout: 30,
                });

            expect(visibilityResponse).toBeDefined();

            // -----------------------------
            // DELETE MESSAGE
            // -----------------------------

            const deleteResponse = await deleteMessage({
                client,
                QueueUrl: queueUrl,
                ReceiptHandle: receiptHandle,
            });

            expect(deleteResponse).toBeDefined();
        },
        60_000,
    );

    it(
        'sends and deletes messages in batches',
        async () => {
            // -----------------------------
            // SEND MESSAGE BATCH
            // -----------------------------

            const sendResponse = await sendMessageBatch({
                client,
                QueueUrl: queueUrl,
                Entries: [
                    {
                        Id: 'message-1',
                        MessageBody: 'Batch message 1',
                    },
                    {
                        Id: 'message-2',
                        MessageBody: 'Batch message 2',
                    },
                ],
            });

            expect(sendResponse.Successful).toBeDefined();
            expect(sendResponse.Successful).toHaveLength(2);

            // -----------------------------
            // RECEIVE MESSAGES
            // -----------------------------

            const receiveResponse = await receiveMessage({
                client,
                QueueUrl: queueUrl,
                MaxNumberOfMessages: 10,
                WaitTimeSeconds: 10,
            });

            expect(receiveResponse.Messages).toBeDefined();
            expect(receiveResponse.Messages?.length).toBeGreaterThan(0);

            const messages = receiveResponse.Messages!;

            const entries = messages
                .filter((message) => message.ReceiptHandle)
                .map((message, index) => ({
                    Id: `delete-${index}`,
                    ReceiptHandle: message.ReceiptHandle!,
                }));

            expect(entries.length).toBeGreaterThan(0);

            // -----------------------------
            // DELETE MESSAGE BATCH
            // -----------------------------

            const deleteResponse = await deleteMessageBatch({
                client,
                QueueUrl: queueUrl,
                Entries: entries,
            });

            expect(deleteResponse.Successful).toBeDefined();
            expect(deleteResponse.Successful).toHaveLength(
                entries.length,
            );
        },
        60_000,
    );

    it(
        'purges the queue',
        async () => {
            await sendMessage({
                client,
                QueueUrl: queueUrl,
                MessageBody: 'Message to purge',
            });

            const response = await purgeQueues({
                client,
                QueueUrl: queueUrl,
            });

            expect(response).toBeDefined();
        },
        30_000,
    );
});
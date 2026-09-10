import {
    describe,
    expect,
    it,
} from 'vitest';

import { createEC2Client } from '../../../src/ec2-service/client.js';

describe('createEC2Client', () => {
    it('creates an EC2Client with the provided configuration', async () => {
        const client = createEC2Client({
            region: 'us-east-1',
            accessKey: 'test-access-key',
            secretKey: 'test-secret-key',
        });

        expect(client).toBeDefined();

        expect(await client.config.region()).toBe(
            'us-east-1',
        );

        const credentials = await client.config.credentials();

        expect(credentials.accessKeyId).toBe(
            'test-access-key',
        );

        expect(credentials.secretAccessKey).toBe(
            'test-secret-key',
        );
    });

    it('passes additional EC2 configuration to the client', async () => {
        const client = createEC2Client({
            region: 'us-east-1',
            accessKey: 'test-access-key',
            secretKey: 'test-secret-key',
            maxAttempts: 5,
        });

        expect(await client.config.region()).toBe(
            'us-east-1',
        );

        expect(await client.config.maxAttempts()).toBe(5);
    });
});
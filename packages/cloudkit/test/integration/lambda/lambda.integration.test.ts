import {
    afterAll,
    beforeAll,
    describe,
    expect,
    it,
} from 'vitest';

import { readFile } from 'node:fs/promises';

import {
    waitUntilFunctionActive,
} from '@aws-sdk/client-lambda';

import { createLambdaClient } from '../../../src/lambda-service/client.js';
import { createLambdaFunction } from '../../../src/lambda-service/createLambdaFunction.js';
import { deleteLambdaFunction } from '../../../src/lambda-service/deleteLambdaFunction.js';
import { getLambdaFunction } from '../../../src/lambda-service/getLambdaFunction.js';
import { invokeLambda } from '../../../src/lambda-service/invokeLambda.js';
import { listLambdaFunctions } from '../../../src/lambda-service/listLambdaFunctions.js';
import { updateLambdaFunction } from '../../../src/lambda-service/updateLambdaFunction.js';

import {
    AWS_REGION,
    AWS_TEST_FUNCTION,
    AWS_TEST_LAMBDA_ROLE_ARN,
    AWS_USER_ACCESS_KEY,
    AWS_USER_SECRET_KEY,
} from '../../../config/env.config.js';

describe('Lambda integration', () => {
    const client = createLambdaClient({
        region: AWS_REGION,
        accessKey: AWS_USER_ACCESS_KEY,
        secretKey: AWS_USER_SECRET_KEY
    });

    beforeAll(
        async () => {
            // Remove a leftover function from a previous test run.
            try {
                await deleteLambdaFunction({
                    client,
                    FunctionName: AWS_TEST_FUNCTION,
                });
            } catch {
                // Function does not exist.
            }

            const zipFile = await readFile(
                new URL(
                    './fixtures/lambda.zip',
                    import.meta.url,
                ),
            );

            const response = await createLambdaFunction({
                client,
                FunctionName: AWS_TEST_FUNCTION,
                Runtime: 'nodejs24.x',
                Role: AWS_TEST_LAMBDA_ROLE_ARN,
                Handler: 'index.handler',
                Code: {
                    ZipFile: zipFile,
                },
            });

            expect(response.FunctionName).toBe(
                AWS_TEST_FUNCTION,
            );

            expect(response.FunctionArn).toBeDefined();

            await waitUntilFunctionActive(
                {
                    client,
                    maxWaitTime: 120,
                },
                {
                    FunctionName: AWS_TEST_FUNCTION,
                },
            );
        },
        180_000,
    );

    afterAll(
        async () => {
            try {
                await deleteLambdaFunction({
                    client,
                    FunctionName: AWS_TEST_FUNCTION,
                });
            } catch {
                // Ignore cleanup errors.
            }
        },
        30_000,
    );

    it('gets the Lambda function', async () => {
        const response = await getLambdaFunction({
            client,
            FunctionName: AWS_TEST_FUNCTION,
        });

        expect(
            response.Configuration?.FunctionName,
        ).toBe(AWS_TEST_FUNCTION);

        expect(
            response.Configuration?.FunctionArn,
        ).toBeDefined();
    });

    it('lists the Lambda function', async () => {
        const response = await listLambdaFunctions({
            client,
        });

        expect(response.Functions).toBeDefined();

        const functionExists = response.Functions?.some(
            (lambda) =>
                lambda.FunctionName === AWS_TEST_FUNCTION,
        );

        expect(functionExists).toBe(true);
    });

    it(
        'invokes the Lambda function',
        async () => {
            const response = await invokeLambda({
                client,
                FunctionName: AWS_TEST_FUNCTION,
                Payload: new TextEncoder().encode(
                    JSON.stringify({
                        test: true,
                    }),
                ),
            });

            expect(response).not.toBeNull();

            expect(response?.result).toEqual({
                success: true,
                version: 1,
                event: {
                    test: true,
                },
            });
        },
        30_000,
    );

    it(
        'updates the Lambda function code',
        async () => {
            const zipFile = await readFile(
                new URL(
                    './fixtures/lambda.zip',
                    import.meta.url,
                ),
            );

            const response = await updateLambdaFunction({
                client,
                FunctionName: AWS_TEST_FUNCTION,
                ZipFile: zipFile,
            });

            expect(response.FunctionName).toBe(
                AWS_TEST_FUNCTION,
            );

            expect(response.FunctionArn).toBeDefined();

            await waitUntilFunctionActive(
                {
                    client,
                    maxWaitTime: 120,
                },
                {
                    FunctionName: AWS_TEST_FUNCTION,
                },
            );
        },
        180_000,
    );

    it(
        'deletes the Lambda function',
        async () => {
            const response = await deleteLambdaFunction({
                client,
                FunctionName: AWS_TEST_FUNCTION,
            });

            expect(response).toBeDefined();

            await expect(
                getLambdaFunction({
                    client,
                    FunctionName: AWS_TEST_FUNCTION,
                }),
            ).rejects.toThrow();
        },
        30_000,
    );
});
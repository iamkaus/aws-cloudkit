import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CreateFunctionCommand, LambdaClient } from '@aws-sdk/client-lambda';

import { createLambdaFunction } from '../../../src/lambda-service/createLambdaFunction.js';

describe('createLambdaFunction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends a CreateFunctionCommand with the provided parameters', async () => {
    const send = vi.fn().mockResolvedValue({
      FunctionArn: 'arn:aws:lambda:us-east-1:123456789:function:test',
      FunctionName: 'test-function',
    });

    const client = {
      send,
    } as unknown as LambdaClient;

    const response = await createLambdaFunction({
      client,
      FunctionName: 'test-function',
      Runtime: 'nodejs22.x',
      Role: 'arn:aws:iam::123456789:role/test-role',
      Handler: 'index.handler',
      Code: {
        ZipFile: new Uint8Array([1, 2, 3]),
      },
    });

    expect(send).toHaveBeenCalledOnce();

    expect(response.FunctionName).toBe('test-function');

    expect(send).toHaveBeenCalledWith(expect.any(CreateFunctionCommand));

    const command = send.mock.calls[0]![0];

    expect(command.input).toEqual({
      FunctionName: 'test-function',
      Runtime: 'nodejs22.x',
      Role: 'arn:aws:iam::123456789:role/test-role',
      Handler: 'index.handler',
      Code: {
        ZipFile: new Uint8Array([1, 2, 3]),
      },
    });
  });
});

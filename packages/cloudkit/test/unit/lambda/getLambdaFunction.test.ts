import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GetFunctionCommand, LambdaClient } from '@aws-sdk/client-lambda';

import { getLambdaFunction } from '../../../src/lambda-service/getLambdaFunction.js';

describe('getLambdaFunction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends a GetFunctionCommand with the provided parameters', async () => {
    const send = vi.fn().mockResolvedValue({
      Configuration: {
        FunctionName: 'test-function',
        Runtime: 'nodejs22.x',
      },
    });

    const client = {
      send,
    } as unknown as LambdaClient;

    const response = await getLambdaFunction({
      client,
      FunctionName: 'test-function',
    });

    expect(send).toHaveBeenCalledOnce();

    expect(response.Configuration?.FunctionName).toBe('test-function');

    expect(send).toHaveBeenCalledWith(expect.any(GetFunctionCommand));

    const command = send.mock.calls[0]![0];

    expect(command.input).toEqual({
      FunctionName: 'test-function',
    });
  });
});

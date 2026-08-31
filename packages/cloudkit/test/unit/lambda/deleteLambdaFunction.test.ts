import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DeleteFunctionCommand, LambdaClient } from '@aws-sdk/client-lambda';

import { deleteLambdaFunction } from '../../../src/lambda-service/deleteLambdaFunction.js';

describe('deleteLambdaFunction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends a DeleteFunctionCommand with the provided parameters', async () => {
    const send = vi.fn().mockResolvedValue({});

    const client = {
      send,
    } as unknown as LambdaClient;

    const response = await deleteLambdaFunction({
      client,
      FunctionName: 'test-function',
    });

    expect(send).toHaveBeenCalledOnce();

    expect(response).toEqual({});

    expect(send).toHaveBeenCalledWith(expect.any(DeleteFunctionCommand));

    const command = send.mock.calls[0]![0];

    expect(command.input).toEqual({
      FunctionName: 'test-function',
    });
  });
});

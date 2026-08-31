import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LambdaClient, UpdateFunctionCodeCommand } from '@aws-sdk/client-lambda';

import { updateLambdaFunction } from '../../../src/lambda-service/updateLambdaFunction.js';

describe('updateLambdaFunction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends an UpdateFunctionCodeCommand with the provided parameters', async () => {
    const send = vi.fn().mockResolvedValue({
      FunctionName: 'test-function',
      LastModified: '2026-08-31T10:00:00.000+0000',
    });

    const client = {
      send,
    } as unknown as LambdaClient;

    const response = await updateLambdaFunction({
      client,
      FunctionName: 'test-function',
      Publish: true,
      ZipFile: new Uint8Array([1, 2, 3]),
    });

    expect(send).toHaveBeenCalledOnce();

    expect(response.FunctionName).toBe('test-function');

    expect(send).toHaveBeenCalledWith(expect.any(UpdateFunctionCodeCommand));

    const command = send.mock.calls[0]![0];

    expect(command.input).toEqual({
      FunctionName: 'test-function',
      Publish: true,
      ZipFile: new Uint8Array([1, 2, 3]),
    });
  });
});

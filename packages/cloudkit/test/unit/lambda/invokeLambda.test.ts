import { beforeEach, describe, expect, it, vi } from 'vitest';

import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';

import { invokeLambda } from '../../../src/lambda-service/invokeLambda.js';

describe('invokeLambda', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('invokes Lambda and parses a JSON payload', async () => {
    const payload = new TextEncoder().encode(
      JSON.stringify({
        message: 'hello',
        value: 42,
      }),
    );

    const send = vi.fn().mockResolvedValue({
      Payload: payload,
      LogResult: undefined,
    });

    const client = {
      send,
    } as unknown as LambdaClient;

    const response = await invokeLambda<{
      message: string;
      value: number;
    }>({
      client,
      FunctionName: 'test-function',
    });

    expect(send).toHaveBeenCalledOnce();

    expect(send).toHaveBeenCalledWith(expect.any(InvokeCommand));

    const command = send.mock.calls[0]![0];

    expect(command.input).toEqual({
      FunctionName: 'test-function',
    });

    expect(response).toEqual({
      result: {
        message: 'hello',
        value: 42,
      },
      logs: null,
    });
  });

  it('returns a raw string when the payload is not valid JSON', async () => {
    const payload = new TextEncoder().encode('hello from lambda');

    const send = vi.fn().mockResolvedValue({
      Payload: payload,
    });

    const client = {
      send,
    } as unknown as LambdaClient;

    const response = await invokeLambda({
      client,
      FunctionName: 'test-function',
    });

    expect(response).toEqual({
      result: 'hello from lambda',
      logs: null,
    });
  });

  it('decodes base64 encoded execution logs', async () => {
    const payload = new TextEncoder().encode(
      JSON.stringify({
        success: true,
      }),
    );

    const logs = Buffer.from('Lambda executed successfully').toString('base64');

    const send = vi.fn().mockResolvedValue({
      Payload: payload,
      LogResult: logs,
    });

    const client = {
      send,
    } as unknown as LambdaClient;

    const response = await invokeLambda({
      client,
      FunctionName: 'test-function',
      LogType: 'Tail',
    });

    expect(response).toEqual({
      result: {
        success: true,
      },
      logs: 'Lambda executed successfully',
    });
  });

  it('returns null when Lambda does not return a payload', async () => {
    const send = vi.fn().mockResolvedValue({
      Payload: undefined,
      LogResult: undefined,
    });

    const client = {
      send,
    } as unknown as LambdaClient;

    const response = await invokeLambda({
      client,
      FunctionName: 'test-function',
    });

    expect(response).toBeNull();
  });
});

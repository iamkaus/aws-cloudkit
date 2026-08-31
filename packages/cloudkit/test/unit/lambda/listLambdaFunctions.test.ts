import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ListFunctionsCommand, LambdaClient } from '@aws-sdk/client-lambda';

import { listLambdaFunctions } from '../../../src/lambda-service/listLambdaFunctions.js';

describe('listLambdaFunctions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends a ListFunctionsCommand with the provided parameters', async () => {
    const send = vi.fn().mockResolvedValue({
      Functions: [
        {
          FunctionName: 'function-one',
        },
        {
          FunctionName: 'function-two',
        },
      ],
    });

    const client = {
      send,
    } as unknown as LambdaClient;

    const response = await listLambdaFunctions({
      client,
      MaxItems: 10,
    });

    expect(send).toHaveBeenCalledOnce();

    expect(response.Functions).toHaveLength(2);

    expect(send).toHaveBeenCalledWith(expect.any(ListFunctionsCommand));

    const command = send.mock.calls[0]![0];

    expect(command.input).toEqual({
      MaxItems: 10,
    });
  });
});

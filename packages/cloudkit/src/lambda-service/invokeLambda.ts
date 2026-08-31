import { LambdaClient, InvokeCommand, type InvokeCommandInput } from '@aws-sdk/client-lambda';

import { Buffer } from 'node:buffer';

type InvokeCommandParams = InvokeCommandInput & {
  client: LambdaClient;
};

type InvokeCommandOutput<T = unknown> = {
  result: T;
  logs: string | null;
};

/**
 * Invokes a Lambda function, abstracts config overhead,
 * and automatically parses the payload and execution logs.
 */
export const invokeLambda = async <T = unknown>(
  params: InvokeCommandParams,
): Promise<InvokeCommandOutput<T> | null> => {
  const { client, ...awsLambdaConfig } = params;
  const command = new InvokeCommand(awsLambdaConfig);
  const { Payload, LogResult } = await client.send(command);

  if (!Payload) return null;

  // Decode logs automatically if requested (via LogType: "Tail")
  const decodedLogs = LogResult ? Buffer.from(LogResult, 'base64').toString('utf-8') : null;

  const rawString = new TextDecoder().decode(Payload);

  try {
    // Try parsing JSON if possible
    const result = JSON.parse(rawString) as T;
    return { result, logs: decodedLogs };
  } catch {
    // Fallback to raw string if it's plain text/binary representation
    return { result: rawString as unknown as T, logs: decodedLogs };
  }
};

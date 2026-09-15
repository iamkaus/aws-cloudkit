import { afterAll, describe, expect, it } from 'vitest';

import { createEC2Client } from '../../../src/ec2-service/client.js';
import { runInstances } from '../../../src/ec2-service/runInstances.js';
import { describeInstances } from '../../../src/ec2-service/describeInstances.js';
import { terminateInstances } from '../../../src/ec2-service/terminateInstances.js';

import {
  AWS_REGION,
  AWS_TEST_INSTANCE_AMI_ID,
  AWS_TEST_INSTANCE_TYPE,
  AWS_USER_ACCESS_KEY,
  AWS_USER_SECRET_KEY,
} from '../../../config/env.config.js';
import { _InstanceType } from '@aws-sdk/client-ec2';

describe('EC2 integration', () => {
  const client = createEC2Client({
    region: AWS_REGION,
    accessKey: AWS_USER_ACCESS_KEY,
    secretKey: AWS_USER_SECRET_KEY,
  });

  let instanceId: string | undefined;

  it('describes a created EC2 instance', async () => {
    const created = await runInstances({
      client,
      ImageId: AWS_TEST_INSTANCE_AMI_ID,
      InstanceType: AWS_TEST_INSTANCE_TYPE as _InstanceType,
      MinCount: 1,
      MaxCount: 1,
    });

    instanceId = created.Instances?.[0]?.InstanceId;

    expect(instanceId).toBeDefined();

    const response = await describeInstances({
      client,
      InstanceIds: [instanceId!],
    });

    const instance = response.Reservations?.[0]?.Instances?.[0];

    expect(instance).toBeDefined();
    expect(instance?.InstanceId).toBe(instanceId);
  });

  afterAll(async () => {
    if (!instanceId) return;

    await terminateInstances({
      client,
      InstanceIds: [instanceId],
    });
  });
});

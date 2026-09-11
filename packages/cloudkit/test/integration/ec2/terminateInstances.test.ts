import {
    describe,
    expect,
    it,
} from 'vitest';

import { createEC2Client } from '../../../src/ec2-service/client.js';
import { runInstances } from '../../../src/ec2-service/runInstances.js';
import { terminateInstances } from '../../../src/ec2-service/terminateInstances.js';

import {
    AWS_REGION,
    AWS_TEST_INSTANCE_AMI_ID,
    AWS_TEST_INSTANCE_TYPE,
    AWS_USER_ACCESS_KEY,
    AWS_USER_SECRET_KEY,
} from '../../../config/env.config.js';

describe('EC2 integration', () => {
    const client = createEC2Client({
        region: AWS_REGION,
        accessKey: AWS_USER_ACCESS_KEY,
        secretKey: AWS_USER_SECRET_KEY
    });

    it('terminates an EC2 instance', async () => {
        const created = await runInstances({
            client,
            ImageId: AWS_TEST_INSTANCE_AMI_ID,
            InstanceType: AWS_TEST_INSTANCE_TYPE as any,
            MinCount: 1,
            MaxCount: 1,
        });

        const instanceId = created.Instances?.[0]?.InstanceId;

        expect(instanceId).toBeDefined();

        const response = await terminateInstances({
            client,
            InstanceIds: [instanceId!],
        });

        const instance = response.TerminatingInstances?.[0];

        expect(instance).toBeDefined();
        expect(instance?.InstanceId).toBe(instanceId);
    });
});
import {
    afterAll,
    describe,
    expect,
    it,
} from 'vitest';
import type { _InstanceType } from '@aws-sdk/client-ec2';
import { createEC2Client } from '../../../src/ec2-service/client.js';
import { runInstances } from '../../../src/ec2-service/runInstances.js';
import { terminateInstances } from '../../../src/ec2-service/terminateInstances.js';

import {
    AWS_REGION,
    AWS_TEST_INSTANCE_TYPE,
    AWS_USER_ACCESS_KEY,
    AWS_USER_SECRET_KEY,
    AWS_TEST_INSTANCE_AMI_ID ,
} from '../../../config/env.config.js';

describe('EC2 integration', () => {
    const client = createEC2Client({
        region: AWS_REGION,
        accessKey: AWS_USER_ACCESS_KEY,
        secretKey: AWS_USER_SECRET_KEY
    });

    let instanceId: string | undefined;

    it('creates an EC2 instance', async () => {
        const response = await runInstances({
            client,
            ImageId: AWS_TEST_INSTANCE_AMI_ID,
            InstanceType: AWS_TEST_INSTANCE_TYPE as _InstanceType,
            MinCount: 1,
            MaxCount: 1,
        });

        instanceId = response.Instances?.[0]?.InstanceId;
        console.log('instanceId: ', instanceId)

        expect(instanceId).toBeDefined();
    });

    afterAll(async () => {
        if (!instanceId) {
            return;
        }

        await terminateInstances({
            client,
            InstanceIds: [instanceId],
        });
    });
});
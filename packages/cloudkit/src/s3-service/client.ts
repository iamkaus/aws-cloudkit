import { S3Client } from '@aws-sdk/client-s3';

interface S3ClientParams {
    region: string;
    accessKey: string;
    secretKey: string;
}

export const createS3Client = ({
    region,
    accessKey,
    secretKey,
}: S3ClientParams): S3Client => {
    return new S3Client({
        region,
        credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
        },
    });
};
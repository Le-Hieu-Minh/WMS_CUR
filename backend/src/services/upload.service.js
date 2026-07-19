import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from '../config/env.js';
import { ApiError, HttpStatus } from '../utils/apiError.js';

let s3Client = null;

function getS3Client() {
  if (!s3Client && env.R2_ACCOUNT_ID && env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY) {
    s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Client;
}

export async function uploadFile(file, folder = 'uploads') {
  const client = getS3Client();

  if (!client) {
    throw new ApiError(HttpStatus.SERVICE_UNAVAILABLE, 'File storage is not configured');
  }

  const key = `${folder}/${Date.now()}-${file.originalname}`;

  await client.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  const url = env.R2_PUBLIC_URL ? `${env.R2_PUBLIC_URL}/${key}` : key;

  return {
    key,
    url,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  };
}

export async function deleteFile(key) {
  const client = getS3Client();
  if (!client) return;

  await client.send(
    new DeleteObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
    })
  );
}

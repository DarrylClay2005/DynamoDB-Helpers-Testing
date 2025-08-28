import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';

// Mock the S3Client
const s3Mock = mockClient(S3Client);

describe('S3 Service', () => {
  beforeEach(() => {
    // Reset the mock before each test to ensure isolation
    s3Mock.reset();
  });

  test('should successfully put an object to S3', async () => {
    // Define the mock response for the PutObjectCommand
    s3Mock.on(PutObjectCommand).resolves({ ETag: 'mock-etag' });

    // Instantiate your S3 client (or the service that uses it)
    const s3 = new S3Client({});

    // Call the function that uses the S3 client
    const result = await s3.send(new PutObjectCommand({
      Bucket: 'my-bucket',
      Key: 'my-key',
      Body: 'my-content',
    }));

    // Assertions
    expect(result.ETag).toEqual('mock-etag');
    expect(s3Mock).toHaveReceivedCommandWith(PutObjectCommand, {
      Bucket: 'my-bucket',
      Key: 'my-key',
      Body: 'my-content',
    });
  });

  test('should handle S3 errors', async () => {
    // Define a mock error response
    s3Mock.on(PutObjectCommand).rejects(new Error('Mock S3 error'));

    const s3 = new S3Client({});

    await expect(s3.send(new PutObjectCommand({
      Bucket: 'my-bucket',
      Key: 'error-key',
      Body: 'error-content',
    }))).rejects.toThrow('Mock S3 error');
  });
});
import { makeRequest } from '../helpers';

interface PresignedUrlResponse {
  fileUrl: string;
  uploadSignedUrl: string;
}

export class S3Service {
  getPresignedUrl = async (): Promise<PresignedUrlResponse> => {
    const resp = await makeRequest<undefined, PresignedUrlResponse>(
      's3/presigned'
    );
    return Promise.resolve(resp.message);
  };
}

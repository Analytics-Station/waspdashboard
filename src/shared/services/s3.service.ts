import { makeRequest } from '../helpers';

interface PresignedUrlResponse {
  fileUrl: string;
  uploadSignedUrl: string;
}

export class S3Service {
  getPresignedUrl = async (
    ext = 'xlsx',
    fileType = 0
  ): Promise<PresignedUrlResponse> => {
    const resp = await makeRequest<undefined, PresignedUrlResponse>(
      `s3/presigned?ext=${ext}&fileType=${fileType}`
    );
    return Promise.resolve(resp.message);
  };
}

import { AxiosHeaders } from 'axios';

import { makeRequest } from '../helpers';
import { RequestMethod } from '../models';

interface PresignedUrlResponse {
  fileUrl: string;
  uploadSignedUrl: string;
  contentType: string;
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

  uploadFile = async (
    uploadUrl: string,
    data: ArrayBuffer,
    mimeType: string
  ) => {
    const headers = new AxiosHeaders({});
    headers.set('Content-Type', mimeType);
    return makeRequest(uploadUrl, RequestMethod.PUT, false, data, headers);
  };
}

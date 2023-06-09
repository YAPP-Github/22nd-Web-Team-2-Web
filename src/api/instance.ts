import ky from 'ky';
import { setAuthorizationHeader } from '@/utils/ky/hooks/beforeRequest';
import {
  retryRequestOnUnauthorized,
  throwServerErrorMessage
} from '@/utils/ky/hooks/afterResponse';

const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json'
  },
  hooks: {
    beforeRequest: [setAuthorizationHeader],
    afterResponse: [retryRequestOnUnauthorized, throwServerErrorMessage]
  }
});

export default api;

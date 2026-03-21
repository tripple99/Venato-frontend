import {type  AxiosRequestConfig } from "axios";

export interface RequestConfig extends AxiosRequestConfig {
  // Optional custom fields
  showToast?: boolean;
  skipAuthorization?: boolean;
  retryCount?: number;
}

export interface ApiConfiguration {
  accessToken?: string;      // Authorization token to be added to all requests
}

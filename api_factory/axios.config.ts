import axios, { type AxiosResponse } from "axios";
import { useUser } from "@/composables/modules/auth/user";
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useNetworkStatus } from '@/composables/core/useNetworkStatus'// const { showToast } = useCustomToast(); // Removed top-level call

const { token, logOut } = useUser();

const $GATEWAY_ENDPOINT_WITHOUT_VERSION = import.meta.env.VITE_API_BASE_URL as string;
const $GATEWAY_ENDPOINT = import.meta.env.VITE_API_BASE_URL + "/api/v1";
const $GATEWAY_ENDPOINT_V2 = import.meta.env.VITE_API_BASE_URL + "/v2";
const $IMAGE_UPLOAD_ENDPOINT = import.meta.env.VITE_IMAGE_UPLOAD_BASE_URL as string;

export const GATEWAY_ENDPOINT = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
});

export const GATEWAY_ENDPOINT_V2 = axios.create({
  baseURL: $GATEWAY_ENDPOINT_V2
});

export const GATEWAY_ENDPOINT_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
});

export const GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  headers: {
    Authorization: `Bearer ${token.value}`,
    "Content-Type": "multipart/form-data",
  },
});

export const GATEWAY_ENDPOINT_WITHOUT_VERSION = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
});
export const GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
});
export const IMAGE_UPLOAD_ENDPOINT = axios.create({
  baseURL: $IMAGE_UPLOAD_ENDPOINT,
});
export interface CustomAxiosResponse extends AxiosResponse {
  value?: any;
  type?: string;
}

const instanceArray = [
  GATEWAY_ENDPOINT,
  GATEWAY_ENDPOINT_V2,
  GATEWAY_ENDPOINT_WITH_AUTH,
  GATEWAY_ENDPOINT_WITHOUT_VERSION,
  GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH,
];

instanceArray.forEach((instance) => {
  instance.defaults.timeout = 15000; // Set global timeout to 15 seconds
  instance.interceptors.request.use((config: any) => {
    const cookie = useCookie('errandr_dispatch_token');
    if (cookie.value) {
      config.headers.Authorization = `Bearer ${cookie.value}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response: CustomAxiosResponse) => {
      return response;
    },
    (err: any) => {
      // Check for timeout or network connection error
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout') || err.message?.includes('Network Error') || typeof err.response === "undefined") {
        try {
          const { recordSlowNetwork } = useNetworkStatus();
          recordSlowNetwork();
        } catch (e) {}
        
        return {
          type: "ERROR",
          ...(err.response || { status: 0, statusText: "Network Error" }),
        };
      }
      if (err.response.status === 401) {
        console.log(err.response.data.error)
        // Only log out if we have a token (it expired) AND we're not already on auth pages
        const isOnAuthPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/auth')
        if (token.value && !isOnAuthPage) {
          logOut();
        }
        useCustomToast().showToast({
          title: "Error",
          message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
          toastType: "error",
          duration: 3000
        });
        return {
          type: "ERROR",
          ...err.response,
        };
      } else if (statusCodeStartsWith(err.response.status, 4)) {
        if (err.response.data.message) {
          useCustomToast().showToast({
            title: "Error",
            message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
            toastType: "error",
            duration: 3000
          });
        }
        return {
          type: "ERROR",
          ...err.response,
        };
      } else if (err.response.status === 500) {
        useCustomToast().showToast({
          title: "Error",
          message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
          toastType: "error",
          duration: 3000
        });
        return {
          type: "ERROR",
          ...err.response,
        };
      } else if (err.response.status === 409) {
        useCustomToast().showToast({
          title: "Error",
          message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
          toastType: "error",
          duration: 3000
        });
      }
    }
  );
});

const statusCodeStartsWith = (
  statusCode: number,
  startNumber: number
): boolean => {
  const statusCodeString = statusCode.toString();
  const startNumberString = startNumber.toString();

  return statusCodeString.startsWith(startNumberString);
};

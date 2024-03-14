import axios, { AxiosError, AxiosResponse } from "axios";
import { buildErrorMessage, getEndpoint, getRequestConfig } from "./ApiHelpers";

const handleSuccess = (
  response: AxiosResponse,
  action: "fetch" | "post" | "update" | "remove" | "put",
  endpoint: string,
  options?: RequestOptions,
) => {
  if (response.status >= 400 || response.data?.error) {
    throw new Error(`Failed to ${action} data from ${endpoint}: ${response.statusText}`);
  }

  if (options?.processData) {
    return options.processData(response);
  }

  return response.data;
};

const handleError = (error: any, action: "getting" | "posting" | "updating" | "removing", options?: RequestOptions) => {
  const errorMessage = buildErrorMessage(error);

  if (options?.processError) {
    const errorData = error?.response?.data as Record<string, any> | undefined;
    options.processError(errorMessage, error, errorData);
  } else {
    const errorSource = options?.source ? ` on ${options.source}` : "";
    // eslint-disable-next-line no-console
    console.error(`Error${errorSource} while ${action} data`, errorMessage);
  }
};

export const get = async (path: string | null, options?: RequestOptions) => {
  if (!path) throw new Error("path is required");
  const endpoint = getEndpoint(path, options?.queryParams);
  const requestConfig = getRequestConfig({
    ...options,
    body: options?.body ?? {},
  });

  try {
    // axios.defaults.headers.get["Access-Control-Allow-Origin"] = "*";
    const response = await axios.get(endpoint, requestConfig);

    return handleSuccess(response, "fetch", endpoint, options);
  } catch (errorResponse: any) {
    errorResponse.errorMessage = buildErrorMessage(errorResponse);
    throw errorResponse;
    // handleError(errorResponse, "getting", options);
    // return null;
  }
};

export const post = async <T>(
  path: string,
  body: Record<string, any>,
  options?: RequestOptions,
  retryCount = 0,
): Promise<T | null> => {
  const endpoint = getEndpoint(path, options?.queryParams);
  const requestConfig = getRequestConfig(options);

  try {
    const response: AxiosResponse = await axios.post(endpoint, body, requestConfig);

    return handleSuccess(response, "post", endpoint, options);
  } catch (errorResponse) {
    if (options?.shouldRetry && retryCount < 3) {
      // Delay next API call by 400ms
      return new Promise((res) => {
        setTimeout(() => res(post(path, body, options, retryCount + 1)), 400);
      });
    }
    handleError(errorResponse, "posting", options);
    return null;
  }
};

export const put = async <T>(
  path: string,
  body: Record<string, any>,
  options?: RequestOptions,
  retryCount = 0,
): Promise<T | null> => {
  const endpoint = getEndpoint(path, options?.queryParams);
  const requestConfig = getRequestConfig(options);

  try {
    const response = await axios.put(endpoint, body, requestConfig);

    return handleSuccess(response, "put", endpoint, options);
  } catch (errorResponse: AxiosError | any) {
    if (options?.shouldRetry && retryCount < 3) {
      // Delay next API call by 400ms
      return new Promise((res) => {
        setTimeout(() => res(put(path, body, options, retryCount + 1)), 400);
      });
    }
    errorResponse.errorMessage = buildErrorMessage(errorResponse);
    throw errorResponse;
    // handleError(errorResponse, "posting", options);
    // return null;
  }
};

export const patch = async (path: string, body: Record<string, any>, options?: RequestOptions) => {
  const endpoint = getEndpoint(path, options?.queryParams);
  const requestConfig = getRequestConfig(options);
  try {
    const response = await axios.patch(endpoint, body, requestConfig);

    return handleSuccess(response, "update", endpoint, options);
  } catch (errorResponse:  any) {
    errorResponse.errorMessage = buildErrorMessage(errorResponse);
    throw errorResponse;
    // handleError(errorResponse, "updating", options);
    // return null;
  }
};

export const remove = async (path: string, options?: RequestOptions) => {
  const endpoint = getEndpoint(path, options?.queryParams);
  const requestConfig = getRequestConfig(options);

  try {
    const response = await axios.delete(endpoint, requestConfig);

    return handleSuccess(response, "remove", endpoint, options);
  } catch (errorResponse) {
    handleError(errorResponse, "removing", options);
    return null;
  }
};

// First Params is URL
// get(".pl", {
//   queryParams: {
//     product: "astro",
//     output: "json",
//   },
// });

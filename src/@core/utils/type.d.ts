type RequestOptions = {
    headers?: Record<string, string>;
    requestConfig?: Record<string, string>;
    body?: Record<string, any>;
    queryParams?: Record<string, string>;
    processData?: (data: any) => any;
    processError?: (errorMessage: string, error: any, errorData: Record<string, any> | undefined) => any;
    source?: string;
    shouldRetry?: boolean;
  };
  
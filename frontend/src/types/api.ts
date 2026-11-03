export type ApiResponse<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};

export type ApiDataResponse<T> = ApiResponse<T> & { data: T };

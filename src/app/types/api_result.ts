
export class ApiResult {
  success: boolean;
  errors?: ApiError[];
}


export class ApiError {
  key: string;
  messages: string[];
  args?: any[];
}

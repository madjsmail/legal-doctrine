import {
  ApiResponseArrayDto,
  ApiResponseDto,
} from 'src/global.dto/response.dto';

export function sendResponse<T>(
  data: T | T[],
  message = 'Request successful',
  status = 'success',
  statusCode: number,
  sort = '',
  page = 1,
  limit = 10,
  totalCount = 0,
): ApiResponseDto<T> | ApiResponseArrayDto<T> {
  if (Array.isArray(data)) {
    return {
      status,
      message,
      data,
      sort,
      pagination: {
        page,
        limit,
        totalCount,
      },
      statusCode,
    };
  } else {
    return {
      status,
      message,
      data,
      sort,
      statusCode,
    };
  }
}

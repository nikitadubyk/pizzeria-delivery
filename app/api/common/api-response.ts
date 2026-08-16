export enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: HttpStatus,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ApiResponse {
  static success<T>(data: T, status = HttpStatus.OK): Response {
    return Response.json(data, { status });
  }

  static error(message: string, status: HttpStatus): Response {
    return Response.json({ error: message }, { status });
  }

  static fromError(error: unknown, fallbackMessage: string): Response {
    if (error instanceof ApiError) {
      return ApiResponse.error(error.message, error.status);
    }

    if (error instanceof SyntaxError) {
      return ApiResponse.error(
        "Некорректное тело запроса",
        HttpStatus.BAD_REQUEST,
      );
    }

    console.error(error);
    return ApiResponse.error(fallbackMessage, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

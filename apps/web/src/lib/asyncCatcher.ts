import { getServerSession, Session } from "next-auth";
import { authOption } from "./auth";

interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

interface ErrorResponse {
  success: false;
  message: string;
  data: null;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppError";
  }
}

export const asyncCatcher = <Args, ReturnType>(
  func: (args: Args) => Promise<ApiResponse<ReturnType>>
): ((args: Args) => Promise<ApiResponse<ReturnType>>) => {
  return async (args: Args) => {
    try {
      return await func(args);
    } catch (error) {
      console.log(error);

      if (error instanceof AppError) {
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }

      return {
        success: false,
        message: "An unexpected error occurred",
        data: null,
      };
    }
  };
};

export type sessionWithArgs<Args> = { session: Session } & Args;

export const authAsyncCatcher = <Args, ReturnType>(
  func: (args: sessionWithArgs<Args>) => Promise<ApiResponse<ReturnType>>
): ((args: Args) => Promise<ApiResponse<ReturnType>>) => {
  return async (args: Args) => {
    try {
      const session = await getServerSession(authOption);

      if (!session || !session.user.id) {
        throw new AppError("Authentication is required");
      }

      return await func({ session, ...args });
    } catch (error) {
      console.log(error);

      if (error instanceof AppError) {
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }

      return {
        success: false,
        message: "An unexpected error occurred",
        data: null,
      };
    }
  };
};

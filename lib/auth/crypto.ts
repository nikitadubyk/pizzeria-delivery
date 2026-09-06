import bcrypt from "bcryptjs";
import { ApiError, HttpStatus } from "@/app/api/common/api-response";
import { BCRYPT_ROUNDS, TokenSecret, TOKEN_SECRET_MIN_LENGTH } from "@/app/api/users/config";

export const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, BCRYPT_ROUNDS);

export const verifyPassword = (password: string, hash: string): Promise<boolean> =>
  bcrypt.compare(password, hash);

export const getTokenSecret = (name: TokenSecret): Uint8Array => {
  const secret = process.env[name];
  if (!secret || secret.length < TOKEN_SECRET_MIN_LENGTH) {
    throw new ApiError(`${name} должен содержать не менее ${TOKEN_SECRET_MIN_LENGTH} символов`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
  return new TextEncoder().encode(secret);
};

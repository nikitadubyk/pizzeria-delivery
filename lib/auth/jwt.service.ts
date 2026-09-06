import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { TokenSecret } from "@/app/api/users/config";
import { getTokenSecret } from "./crypto";

type TokenOptions = {
  secret: TokenSecret;
  issuer?: string;
  audience?: string;
};

export class JwtService {
  constructor(private readonly options: TokenOptions) {}

  sign(subject: string, claims: JWTPayload, expiresIn: string): Promise<string> {
    const token = new SignJWT(claims)
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(subject)
      .setIssuedAt()
      .setExpirationTime(expiresIn);

    if (this.options.issuer) token.setIssuer(this.options.issuer);
    if (this.options.audience) token.setAudience(this.options.audience);

    return token.sign(getTokenSecret(this.options.secret));
  }

  async verify(token: string): Promise<JWTPayload> {
    const { payload } = await jwtVerify(token, getTokenSecret(this.options.secret), {
      algorithms: ["HS256"],
      issuer: this.options.issuer,
      audience: this.options.audience,
    });
    return payload;
  }
}

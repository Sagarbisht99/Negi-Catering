import { jwtVerify, SignJWT, type JWTPayload } from "jose";

export const ADMIN_SESSION_COOKIE = "admin_session";

export type AdminSession = JWTPayload & {
  user: string;
  role: "admin";
};

function encodedKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function encryptSession(payload: AdminSession) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey());
}

export async function decryptSession(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey(), {
      algorithms: ["HS256"],
    });
    if (payload.role !== "admin" || typeof payload.user !== "string") {
      return null;
    }
    return payload as AdminSession;
  } catch {
    return null;
  }
}

import { redis } from "@/lib/redis";
import Elysia from "elysia";

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

// This middleware checks for the presence of a roomId in the query parameters and an x-auth-token in the cookies. It then verifies that the token is valid for the specified room by checking against the Redis store. If any of these checks fail, it throws an AuthError, which is handled to return a 401 Unauthorized response.
export const authMiddleware = new Elysia({
  name: "auth",
})
  .error({ AuthError })
  .onError(({ code, set }) => {
    if (code === "AuthError") {
      set.status = 401;
      return { error: "Unauthorized" };
    }
  })
  .derive({ as: "scoped" }, async ({ query, cookie }) => {
    const roomId = query.roomId;
    const token = cookie["x-auth-token"].value as string | undefined;
    if (!roomId || !token) {
      throw new AuthError("Missing roomId or token.");
    }
    const connected = await redis.hget<string[]>(`meta:${roomId}`, "connected");
    if (!connected || !connected.includes(token)) {
      throw new AuthError("Invalid token for the specified room.");
    }
    return { auth: { roomId, token, connected } };
  });

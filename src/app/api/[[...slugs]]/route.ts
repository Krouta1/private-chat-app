import { redis } from "@/lib/redis";
import { Elysia, t } from "elysia";
import { nanoid } from "nanoid";
import { authMiddleware } from "./auth";
import z from "zod";
import { Message, realtime } from "@/lib/realtime";

const ROOM_TTL_SECONDS = 10 * 60; // 10 minutes

const rooms = new Elysia({ prefix: "/room" }).post("/create", async () => {
  const roomId = nanoid();
  await redis.hset(`meta:${roomId}`, {
    connected: [],
    createdAt: Date.now(),
  });

  await redis.expire(`meta:${roomId}`, ROOM_TTL_SECONDS);
  return { roomId };
});

const messages = new Elysia({ prefix: "/messages" }).use(authMiddleware).post(
  "/",
  async ({ body, auth }) => {
    const { roomId, token, connected } = auth;
    const { sender, text } = body;

    const roomExists = await redis.exists(`meta:${roomId}`);
    if (!roomExists) {
      throw new Error("Room does not exist.");
    }
    const message: Message = {
      id: nanoid(),
      sender,
      text,
      timestamp: Date.now(),
      roomId,
      token,
    };

    // add message to history
    await redis.rpush(`messages:${roomId}`, { ...message, token: auth.token });
    await realtime.channel(roomId).emit("chat.message", message);

    // housekeeping: remove old messages and expired rooms
    const reaminningTTL = await redis.ttl(`meta:${roomId}`);
    await redis.expire(`messages:${roomId}`, reaminningTTL);
    await redis.expire(`history:${roomId}`, reaminningTTL);
    await redis.expire(roomId, reaminningTTL);
  },
  {
    query: z.object({
      roomId: z.string(),
    }),
    body: z.object({
      sender: z.string().max(100),
      text: z.string().max(1000),
    }),
  },
);

const app = new Elysia({ prefix: "/api" }).use(rooms).use(messages);

export type app = typeof app;

export const GET = app.fetch;
export const POST = app.fetch;

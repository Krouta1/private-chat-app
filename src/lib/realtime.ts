import { InferRealtimeEvents, Realtime } from "@upstash/realtime";
import { redis } from "./redis";
import z from "zod";

const messageSchema = z.object({
  id: z.string(),
  sender: z.string(),
  text: z.string(),
  timestamp: z.number(),
  roomId: z.string(),
  token: z.string().optional(),
});

const schema = {
  chat: {
    message: messageSchema,
    destroy: z.object({
      isDestroyed: z.literal(true),
    }),
  },
};

export const realtime = new Realtime({ schema, redis });
export type RealtimeEvents = InferRealtimeEvents<typeof realtime>;

// pure ts type inference for message
export type Message = z.infer<typeof messageSchema>;

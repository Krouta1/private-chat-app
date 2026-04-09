# `private_chat`

A private, temporary chat room app built with `Next.js 16`, `React 19`, `Elysia`, `Upstash Redis`, and `Upstash Realtime`.

Users create a room, share the link, and chat in real time with anonymous identities. Each room is limited to two participants and automatically expires after **10 minutes**.

## ✨ Features

- Create a secure room with a unique ID
- Anonymous usernames generated and stored locally
- Real-time message delivery
- Two-user room limit
- Auto-expiring room and message history
- Cookie-based room access control
- Minimal terminal-inspired UI

## 🧱 Tech Stack

| Layer               | Technology                   |
| ------------------- | ---------------------------- |
| App framework       | `Next.js 16`                 |
| UI                  | `React 19`, `Tailwind CSS 4` |
| API layer           | `Elysia` route handlers      |
| State/data fetching | `@tanstack/react-query`      |
| Storage             | `Upstash Redis`              |
| Realtime events     | `@upstash/realtime`          |
| Validation          | `zod`                        |

## 🚀 Getting Started

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

### 3. Start the development server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🗂️ Main Flow

1. Open the lobby and create a room
2. Share the generated `/room/[roomId]` link
3. A second user joins the room
4. Messages sync in real time
5. The room self-destructs when its TTL reaches zero

## 📁 Project Structure

```text
src/
  app/
    page.tsx                 # Lobby / room creation screen
    room/[roomId]/page.tsx   # Chat room UI
    api/[[...slugs]]/route.ts# Elysia-backed API endpoints
    api/realtime/route.ts    # Realtime endpoint
  components/providers.tsx   # React Query + Realtime providers
  hooks/use-username.ts      # Anonymous username generation
  lib/redis.ts               # Upstash Redis client
  lib/realtime.ts            # Realtime schema and event types
  proxy.ts                   # Room access control and cookie setup
```

## 🔌 API Endpoints

- `POST /api/room/create` — create a new room
- `GET /api/room/ttl?roomId=...` — fetch remaining room lifetime
- `GET /api/messages?roomId=...` — load message history
- `POST /api/messages?roomId=...` — send a message
- `GET /api/realtime` — realtime transport endpoint

## 📝 Notes

- Room metadata and messages are stored in Redis with expiration.
- Access is guarded by an `x-auth-token` cookie per room.
- The app is designed for short-lived, low-friction private chats.

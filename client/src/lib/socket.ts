// lib/socket.ts
import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ;

export const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
  autoConnect: false, // 🟢 Page/Component load हुँदा मात्रै connect गराउन safe हुन्छ
});
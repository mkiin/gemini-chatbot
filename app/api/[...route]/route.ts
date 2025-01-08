import { Hono } from "hono";
import { handle } from "hono/vercel";
import { chat } from "@/server/routes/chat";
import { history } from "@/server/routes/history";
import { reservation } from "@/server/routes/reservation";
export const runtime = "edge";

const app = new Hono().basePath("/api");

const routes = app
  .route("/chat", chat)
  .route("/history", history)
  .route("/reservation", reservation);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;

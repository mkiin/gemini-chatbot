import { auth } from "@/app/(auth)/auth";
import { createMiddleware } from "hono/factory";
import { type Session } from "next-auth";

export type HonoSession = {
  Variables: {
    session: Session | null;
  };
};

export const sessionMiddleware = createMiddleware<HonoSession>(
  async (c, next) => {
    const session = await auth();
    c.set("session", session);
    await next();
  }
);

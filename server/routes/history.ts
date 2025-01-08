import { Hono } from "hono";
import { getChatById } from "@/db/queries";
import { sessionMiddleware } from "../middlewares/session";
import { HTTPException } from "hono/http-exception";

const dummyChats = [
  {
    id: "1",
    createdAt: "2021-09-01T00:00:00.000Z",
    messages: "Hello",
    userId: "1",
  },
];

export const history = new Hono()
  .use("/", sessionMiddleware)
  .get("/", async (c) => {
    const session = c.var.session;
    if (!session || !session.user) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }
    const chats = dummyChats;
    return c.json(chats);
  });

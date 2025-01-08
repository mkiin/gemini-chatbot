import { getReservationById, updateReservation } from "@/db/queries";
import { Hono } from "hono";
import { sessionMiddleware } from "../middlewares/session";
import { HTTPException } from "hono/http-exception";

export const reservation = new Hono()
  .use("/", sessionMiddleware)
  .get("/:id", async (c) => {
    const { id } = c.req.param();
    if (!id) {
      throw new HTTPException(404, { message: "Not Found!" });
    }
    const session = c.var.session;
    if (!session || !session.user) {
      throw new HTTPException(401, { message: "Unauthorized!" });
    }

    try {
      const reservation = await getReservationById({ id });
      if (reservation.userId !== session.user.id) {
        throw new HTTPException(401, { message: "Unauthorized!" });
      }
      return c.json(reservation);
    } catch (error) {
      throw new HTTPException(500, {
        message: "An error occurred while processing your request!",
      });
    }
  })
  .patch("/:id", async (c) => {
    const { id } = c.req.param();
    if (!id) {
      throw new HTTPException(404, { message: "Not Found!" });
    }
    const session = c.var.session;
    if (!session || !session.user) {
      throw new HTTPException(401, { message: "Unauthorized!" });
    }

    try {
      const reservation = await getReservationById({ id });

      if (!reservation) {
        throw new HTTPException(404, { message: "Reservation not found!" });
      }

      if (reservation.userId !== session.user.id) {
        throw new HTTPException(401, { message: "Unauthorized!" });
      }

      if (reservation.hasCompletedPayment) {
        throw new HTTPException(409, {
          message: "Reservation is already paid!",
        });
      }

      const { magicWord } = await c.req.json();

      if (magicWord.toLowerCase() !== "vercel") {
        throw new HTTPException(400, { message: "Invalid magic word!" });
      }

      const updatedReservation = await updateReservation({
        id,
        hasCompletedPayment: true,
      });
      return c.json(updatedReservation);
    } catch (error) {
      throw new HTTPException(500, {
        message: "An error occurred while processing your request!",
      });
    }
  });

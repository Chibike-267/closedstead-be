import express, { Request, Response } from "express";
import authenticateMiddleware from "../../library/middlewares/auth";
import {
  createReservation,
  updateReservation,
  reservationBelongingToUser,
  reservationBelongingToUnit,
  getSingleReservation,
} from "./reservationsController";

const router = express.Router();

router.get("/reservations", (req: Request, res: Response) => {
  res.status(200).json({ message: "success" });
});
router.post("/create-reservation", authenticateMiddleware, createReservation);
router.put(
  "/update-reservation/:unitId/:reservationId",
  authenticateMiddleware,
  updateReservation
);
router.get(
  "/reservations/user",
  authenticateMiddleware,
  reservationBelongingToUser
);
router.get(
  "/reservations/unit/:unitId",
  authenticateMiddleware,
  reservationBelongingToUnit
);
router.get(
  "/single-reservations/:id",
  authenticateMiddleware,
  getSingleReservation
);

export default router;

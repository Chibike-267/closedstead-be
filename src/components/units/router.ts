import express, { Request, Response } from "express";
import authenticateMiddleware from "../../library/middlewares/auth";
import {
  createUnits,
  unitsBeloningToUser,
  updateUnits,
} from "./unitsController";

const router = express.Router();

router.get("/users", (req: Request, res: Response) => {
  res.status(200).json({ message: "success" });
});
router.post("/create-unit", authenticateMiddleware, createUnits);
router.put("/update-unit/:id", authenticateMiddleware, updateUnits);
router.get("/my-units", authenticateMiddleware, unitsBeloningToUser);

export default router;

// router.post("/create-unit", createUnits);
// router.put("/update-unit/:id", updateUnits);

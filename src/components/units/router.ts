import express, { Request, Response } from "express";
import { AuthMiddleware } from "../../library/middlewares/auth";
import { createUnits, updateUnits } from "./unitsController";

const router = express.Router();

router.get("/users", (req: Request, res: Response) => {
  res.status(200).json({ message: "success" });
});
router.post("/create-unit", AuthMiddleware.Authenticate, createUnits);
router.put("/update-unit/:id", AuthMiddleware.Authenticate, updateUnits);

export default router;

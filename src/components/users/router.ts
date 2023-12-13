import express, { Request, Response } from "express";
import { registerUser } from "./usersController";

const router = express.Router();

router.get("/home", (req: Request, res: Response) => {
  res.status(200).json({ message: "success" });
});

router.post("/register", registerUser);

export default router;

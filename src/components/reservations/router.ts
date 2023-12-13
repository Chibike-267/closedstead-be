import express, { Request, Response } from "express";

const router = express.Router();

router.get("/reservations", (req: Request, res: Response) => {
  res.status(200).json({ message: "success" });
});

export default router;

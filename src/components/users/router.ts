import express, { Request, Response } from "express";
import { login, logout, registerUser, getUsers } from "./usersController";

const router = express.Router();

router.get("/home", (req: Request, res: Response) => {
  res.status(200).json({ message: "success" });
});

router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getAllUsers", getUsers);

export default router;

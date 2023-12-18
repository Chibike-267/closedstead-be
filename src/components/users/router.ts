import express, { Request, Response } from "express";
<<<<<<< HEAD
import {
  forgotPassword,
  login,
  logout,
  registerUser,
  sendResetPasswordOtp,
  resetPassword,
} from "./usersController";
=======
import { login, logout, registerUser, getUsers } from "./usersController";
>>>>>>> 6b5748a566ded02b3005fe5234551301de824ead

const router = express.Router();

router.get("/home", (req: Request, res: Response) => {
  res.status(200).json({ message: "success" });
});

router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", logout);
<<<<<<< HEAD
router.post("/sendResetPasswordOtp", sendResetPasswordOtp);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
=======
router.get("/getAllUsers", getUsers);
>>>>>>> 6b5748a566ded02b3005fe5234551301de824ead

export default router;

import express, { Request, Response } from "express";
import {
  forgotPassword,
  login,
  logout,
  registerUser,
  sendResetPasswordOtp,
  resetPassword,
<<<<<<< HEAD
  getUsers
=======
  changePassword,
>>>>>>> 8fdaee9f394f22b04d04a95f228baf3212c3e021
} from "./usersController";
import { AuthMiddleware } from "../../library/middlewares/auth";


const router = express.Router();

router.get("/home", (req: Request, res: Response) => {
  res.status(200).json({ message: "success" });
});

router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", logout);
router.post("/sendResetPasswordOtp", sendResetPasswordOtp);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
<<<<<<< HEAD
router.get("/getAllUsers", AuthMiddleware.Authenticate("user"), getUsers);
=======
router.post("/changePassword", changePassword);
>>>>>>> 8fdaee9f394f22b04d04a95f228baf3212c3e021

export default router;

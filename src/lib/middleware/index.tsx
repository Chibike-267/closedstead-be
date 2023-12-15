import { NextFunction, Request, Response } from "express";
import { UsersModel } from "../../components/users/model";

export class AuthMiddleware {
  static Authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (req.user) {
        const { id, email } = req.user as any;
        const user = await UsersModel.findOne({
          where: { googleId: id, email },
        });

        if (user) {
          next();
        } else {
          res.status(401).send("Unauthorized");
        }
      } else {
        res.status(401).send("Unauthorized, user not authenticated");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

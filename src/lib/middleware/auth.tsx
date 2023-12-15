import { NextFunction, Request, Response } from "express";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { User, UserModel } from "../../components/users/model";
 
export class AuthMiddleware {
  static Authenticate =
    (auth: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = req.headers["authorization"] as string;
        console.log(token);
 
        if (!token) {
          return res
            .status(401)
            .json({ error: "unauthorized, no token provided" });
        }
        const verified = Jwt.verify(token, process.env.JWT_SECRET!);
        if (!verified) {
          return res.status(401).json({ error: "unauthorized" });
        }
        const { id } = verified as JwtPayload;
        const user = (await UserModel.findOne({
          where: { id },
        })) as unknown as User;
 
        if (!auth.includes(user.role)) {
          return res.status(401).json({ error: "Unauthorized" });
        }
        req.user = user.id;
        next();
      } catch (error) {
        return res.status(500).json({ error });
      }
    };
}
 
import { NextFunction, Request, Response } from "express";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { UsersModel } from "../../components/users/model";

//================== I changed from this class based middleware, because I dont see the need in this project, 
//since it could be simpler ==================//
 
// export class AuthMiddleware {
//   static Authenticate =
//     (auth: string) =>
//     async (req: Request, res: Response, next: NextFunction) => {
//       try {
//         const token = req.headers["Authorization"] as string;
//         console.log(token);
 
//         if (!token) {
//           return res
//             .status(401)
//             .json({ error: "unauthorized, no token provided" });
//         }
//         const verified = Jwt.verify(token, process.env.JWT_SECRET!);
//         if (!verified) {
//           return res.status(401).json({ error: "unauthorized" });
//         }
//         const { id } = verified as JwtPayload;
//         const user = (await UsersModel.findOne({
//           where: { id },
//         })) 
//         if (!user) {
//           return res.status(401).json({ error: "unauthorized" });
//         }
//         req.user = user.dataValues;
//         next();
//       } catch (error) {
//         console.error("Authentication error:", error);
//         return res.status(500).json({ error });
//       }
//     };
// }
 

const authenticateMiddleware = async (req: Request, res: Response , next: NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'unauthorized, no token provided' });
    }

    const verified = Jwt.verify(token, process.env.JWT_SECRET!);

    if (!verified) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const { id } = verified as JwtPayload;
    const user = await UsersModel.findOne({
      where: { id },
    });

    if (!user) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    req.user = user.dataValues;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error });
  }
};

export default authenticateMiddleware;

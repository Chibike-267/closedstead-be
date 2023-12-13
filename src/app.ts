import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
// import session from "express-session";
import logger from "morgan";
import passport from "passport";
import router from "./routes";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// secure apps. should be placed before any authentication middleware
app.use(helmet());
// enable cors
app.use(cors());

// app.use(passport.initialize());
// app.use(passport.session());

app.use(router);
// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).send("Not Found");
});
export default app;

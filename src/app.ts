import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";
import logger from "morgan";
import passport from "passport";
import { configureGoogleStrategy } from "./components/OAuth";
import router from "./routes";

const app = express();

app.use(logger("dev"));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(cookieParser());
// secure apps. should be placed before any authentication middleware
app.use(helmet());
// enable cors
app.use(cors());

const sessionSecret = process.env.SECRET || "defaultSecret";

app.use(
  session({
    secret: [sessionSecret],
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use("google", configureGoogleStrategy());
passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

passport.serializeUser((user, done) => {
  done(null, user);
});

// Google Authentication routes
// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["email", "profile"] })
// );
app.get(
  "/auth/google",
  passport.authenticate("google", {
    prompt: "select_account",
    scope: ["email", "profile"],
  })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
  }),
  (req: Request, res: Response) => {
    res.status(200).json({ message: "succesfully logged in" });
  }
);

app.get("/auth/failure", (req, res) => {
  res.send("something went wrong...");
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    console.log("User Logged out");
    res.redirect("/login");
  });
});

app.use(router);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

export default app;

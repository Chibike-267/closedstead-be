import { Request } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { v4 as uuid } from "uuid";
import { UsersModel } from "../users/model";

export interface Profile {
  id: string;
  displayName: string;
  email: string;
  photos: [{ value: string }];
}

const strategy = GoogleStrategy;

// if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
//   throw new Error("Google OAuth client ID or client secret not provided.");
// }

export const configureGoogleStrategy = () => {
  return new strategy(
    {
      //   clientID: process.env.GOOGLE_CLIENT_ID!,
      //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      clientID:
        "131406892761-m8tnp3av8n5imtio1ic2q6atateisiat.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/google/callback",
      passReqToCallback: true,
    },
    async (
      request: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: any
    ) => {
      try {
        const user = await UsersModel.findOne({
          where: { googleId: profile.id, email: profile.email },
        });

        if (user) {
          return done(null, profile);
        }

        const id = uuid();
        const existingEmail = await UsersModel.findOne({
          where: { googleId: "", email: profile.email },
        });

        if (existingEmail) {
          return done("User already exists", null);
        }

        const savedUser = new UsersModel({
          id,
          email: profile.email,
          fullname: profile.displayName,
          googleId: profile.id,
          phone: "",
          password: "",
          expiresAt: 0,
        });

        await savedUser.save();

        return done(null, savedUser);
      } catch (error) {
        console.error(error);
        return done(error);
      }
    }
  );
};

import { registerUserSchema, option, hashPassword } from "../../utils/utils";
import { Request, Response } from "express";
import { UsersModel } from "./model";
import { v4 as uuidv4 } from "uuid";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, firstName, surname, password, phone } = req.body;

    const validate = registerUserSchema.validate(req.body, option);

    if (validate.error) {
      return res.status(400).json({ Error: validate.error.details[0].message });
    }

    const exists = await UsersModel.findOne({ where: { email } });

    if (exists) {
      return res.status(400).json({ message: "email already exists" });
    }

    const id = uuidv4();

    const newUser = await UsersModel.create({
      ...validate.value,
      id,
      password: await hashPassword(password),
    });

    return res.status(201).json({
      newUser,
      message: "user created successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

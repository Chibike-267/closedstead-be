import {
  registerUserSchema,
  option,
  hashPassword,
  loginUserSchema,
  bcryptDecode,
  generateToken,
} from "../../utils/utils";
import { Request, Response } from "express";
import { UsersModel } from "./model";
import { v4 as uuidv4 } from "uuid";


// -------------------------------------------REGISTER USERS----------------------------------------
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
    console.error("Error during user registration:", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const logout = async (req: Request, res: Response) => {
  req.session.destroy(() => {
    return res
      .status(200)
      .json({ message: "Logout successful. Come back soon!" });
  });
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const validate = loginUserSchema.validate(req.body, option);

    if (validate.error) {
      return res.status(400).json({ Error: validate.error.details[0].message });
    }

    const exists = await UsersModel.findOne({
      where: { email },
    });

    if (!exists) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const validPassword = await bcryptDecode(
      password,
      exists.dataValues.password
    );

    if (!validPassword) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const token = await generateToken(email, exists.dataValues.id);

    return res.status(200).json({ token, message: "login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};



// -------------------------------------------GET ALL USERS----------------------------------------
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UsersModel.findAll({
      // where: { role: ROLE.EMPLOYEE },
    });

    return res
      .status(200)
      .json({ users, message: "You have successfully retrieved all users" });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error, message: "error fetching users" });
  }
};
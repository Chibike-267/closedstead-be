import { UnitsModel } from "./model";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import { createUnitsSchema, option } from "../../utils/utils";

export const createUnits = async (req: Request, res: Response) => {
  try {
    const {
      name,
      number,
      status,
      numberOfBedrooms,
      price,
      pictures,
      type,
      userId,
      location,
      description,
    } = req.body;

    const validate = createUnitsSchema.validate(req.body, option);

    if (validate.error) {
      return res.status(400).json({ Error: validate.error.details[0].message });
    }

    const id = uuidv4();

    const newUnit = await UnitsModel.create({
      ...validate.value,
      id,
    });

    return res.status(201).json({
      newUnit,
      message: "unit created successfully",
    });
  } catch (error) {
    console.error("Error during unit creation:", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

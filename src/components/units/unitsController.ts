import { UnitsModel } from "./model";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import {
  createUnitsSchema,
  option,
  updateUnitsSchema,
} from "../../utils/utils";

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
      location,
      description,
    } = req.body;

    const validate = createUnitsSchema.validate(req.body, option);

    if (validate.error) {
      return res.status(400).json({ Error: validate.error.details[0].message });
    }

    const id = uuidv4();

    const userId = req.user.id;

    const newUnit = await UnitsModel.create({
      ...validate.value,
      id,
      userId,
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

export const updateUnits = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      number,
      status,
      numberOfBedrooms,
      price,
      pictures,
      type,
      location,
      description,
    } = req.body;

    const validate = updateUnitsSchema.validate(req.body, option);

    if (validate.error) {
      return res.status(400).json({ Error: validate.error.details[0].message });
    }

    const unit = await UnitsModel.findOne({ where: { id } });

    if (!unit) {
      return res.status(404).json({ message: "unit not found" });
    }

    const userId = req.user.id;

    await UnitsModel.update(
      {
        ...validate.value,
        userId,
      },
      { where: { id } }
    );

    return res.status(200).json({ message: "unit updated successfully" });
  } catch (error) {
    console.error("Error during unit update:", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const unitsBeloningToUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const units = await UnitsModel.findAll({ where: { userId } });

    if (!units) {
      return res.status(404).json({ message: "units not found" });
    }

    return res.status(200).json({ units });
  } catch (error) {
    console.error("Error during unit update:", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

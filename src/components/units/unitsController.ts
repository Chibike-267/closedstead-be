import { UnitsModel, db } from "./model";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import {
  createUnitsSchema,
  option,
  updateUnitsSchema,
} from "../../utils/utils";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { Op } from "sequelize";
import UserRequest from "../../types/userRequest";

export const createUnits = async (req: UserRequest, res: Response) => {
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

    const userId = req.user?.id;

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

export const updateUnits = async (req: UserRequest, res: Response) => {
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

    const userId = req.user?.id;

    const unit = await UnitsModel.findOne({ where: { id, userId } });

    if (!unit) {
      return res.status(404).json({ message: "unit not found" });
    }

    const [affectedRows, updatedUnits] = await UnitsModel.update(
      {
        ...validate.value,
        userId,
      },
      { where: { id }, returning: true }
    );

    return res
      .status(200)
      .json({ updatedUnits, message: "unit updated successfully" });
  } catch (error) {
    console.error("Error during unit update:", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const filterUnits = async (req: UserRequest, res: Response) => {
  try {
    const { location, status } = req.query;

    if (!location && !status) {
      return res.status(400).json({
        error:
          "Please provide either location or status in the query parameters",
      });
    }

    let orderField: string = "createdAt";
    if (location && status) {
      return res.status(400).json({
        error: "Please provide either location or status, not both",
      });
    } else if (location) {
      orderField = "location";
    } else if (status) {
      orderField = "status";
    }

    const units = await UnitsModel.findAll({
      where: {
        ...(location ? { location } : {}),
        ...(status ? { status } : {}),
      },
      order: [[orderField, "DESC"]],
    });

    if (units.length === 0) {
      return res.status(404).json({ message: "No matches found" });
    }

    return res.status(200).json({ message: "Units found successfully", units });
  } catch (error) {
    console.error("Error during filtering units:", error);
    return res.status(500).json({ error });
  }
};

export const searchUnits = async (req: UserRequest, res: Response) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({
        error: "Please provide a search text in the query parameters",
      });
    }

    const units = await UnitsModel.findAll({
      where: {
        name: { [Op.like]: `%${search}%` },
      },
      order: [["createdAt", "DESC"]],
    });

    if (units.length === 0) {
      return res.status(404).json({ message: "No matches found" });
    }

    return res.status(200).json({ message: "Units found successfully", units });
  } catch (error) {
    console.error("Error during filtering units:", error);
    return res.status(500).json({ error });
  }
};

export const unitsBeloningToUser = async (req: UserRequest, res: Response) => {
  try {
    // const { userId } = req.params; --- if the frontend person chooses to optionally use this approach

    const userId = req.user?.id;

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

export const getSingleUnit = async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;

    const userId = req.user?.id;

    const unit = await UnitsModel.findOne({ where: { id, userId } });

    if (!unit) {
      return res.status(404).json({ message: "unit not found" });
    }

    return res.status(200).json({ unit });
  } catch (error) {
    console.error("Error during unit update:", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const getAllAvailableUnits = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const availableUnits = await UnitsModel.findAll({
      where: {
        status: "available",
        userId: userId,
      },
    });

    return res.status(200).json({ units: availableUnits });
  } catch (error) {
    console.error("Error retrieving available units:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllUnavailableUnits = async (
  req: UserRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    const unavailableUnits = await UnitsModel.findAll({
      where: {
        status: "occupied",
        userId: userId,
      },
    });

    return res.status(200).json({ units: unavailableUnits });
  } catch (error) {
    console.error("Error retrieving unavailable units:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const unitsLocationByUser = async (req: Request, res: Response) => {
  try {
    // const { userId } = req.params; --- if the frontend person chooses to optionally use this approach

    const token = req.cookies.token;
    const verified = Jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const userId = verified.id;

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

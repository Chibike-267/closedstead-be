import { ReservationsModel } from "./model";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import {
  createReservationSchema,
  updateReservationSchema,
  option,
} from "../../utils/utils";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { UnitsModel } from "../units/model"; // Import UnitsModel assuming it is correctly defined
import UserRequest from "../../types/userRequest";

export const createReservation = async (req: UserRequest, res: Response) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      checkInDate,
      checkOutDate,
      unitId,
    } = req.body;

    const validate = createReservationSchema.validate(req.body, option);

    if (validate.error) {
      return res.status(400).json({ error: validate.error.details[0].message });
    }

    // Ensure unitId is present
    if (!unitId) {
      return res.status(400).json({ error: "unitId is required" });
    }

    // Check if the unit with provided unitId exists
    const unit = await UnitsModel.findByPk(unitId);

    if (!unit) {
      return res.status(400).json({ error: "Invalid unitId, unit not found" });
    }

    const userId = req.user?.id;
    console.log("this is the userId: ", userId);

    const newReservation = await ReservationsModel.create({
      id: uuidv4(),
      customerName,
      customerEmail,
      customerPhone,
      checkInDate,
      checkOutDate,
      userId,
      unitId,
      status: "reserved",
    });

    return res.status(201).json({
      newReservation,
      message: "reservation created successfully",
    });
  } catch (error) {
    console.error("Error during reservation creation:", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const updateReservation = async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      customerName,
      customerEmail,
      customerPhone,
      checkInDate,
      checkOutDate,
      status,
    } = req.body;

    // Validate request body
    const validate = updateReservationSchema.validate(req.body, option);

    if (validate.error) {
      return res.status(400).json({ error: validate.error.details[0].message });
    }

    // Get user ID from the token
    const userId = req.user?.id;

    // Check if the reservation exists and belongs to the user
    const reservation = await ReservationsModel.findOne({
      where: { id, userId },
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Update the reservation
    const [affectedRows, updatedReservation] = await ReservationsModel.update(
      { ...validate.value, userId },
      { where: { id }, returning: true }
    );

    // Check if the update was successful
    if (affectedRows === 0) {
      return res.status(500).json({ message: "Failed to update reservation" });
    }

    return res.status(200).json({
      updatedReservation: updatedReservation[0],
      message: "Reservation updated successfully",
    });
  } catch (error) {
    console.error("Error during reservation update:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const reservationBelongingToUser = async (
  req: UserRequest,
  res: Response
) => {
  try {
    // const { userId } = req.params; --- if the frontend person chooses to optionally use this approach

    const userId = req.user?.id;

    const reservation = await ReservationsModel.findAll({ where: { userId } });

    if (!reservation) {
      return res.status(404).json({ message: "reservation not found" });
    }

    return res.status(200).json({ reservation });
  } catch (error) {
    console.error("Error fetching reservation", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const reservationBelongingToUnit = async (
  req: UserRequest,
  res: Response
) => {
  try {
    const { unitId } = req.params; // Assuming the unitId is in the request parameters

    // If unitId is not in req.params, you can try to get it from req.body
    // const { unitId } = req.body;

    console.log(unitId);

    if (!unitId) {
      return res.status(400).json({
        message: "unitId is required in the request parameters or body",
      });
    }

    const reservations = await ReservationsModel.findAll({ where: { unitId } });

    if (!reservations || reservations.length === 0) {
      return res
        .status(404)
        .json({ message: "Reservations not found for the unit" });
    }

    return res.status(200).json({ reservations });
  } catch (error) {
    console.error("Error fetching reservations", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getSingleReservation = async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;

    const userId = req.user?.id;

    const reservation = await ReservationsModel.findOne({
      where: { id, userId },
    });

    if (!reservation) {
      return res.status(404).json({ message: "reservation not found" });
    }

    return res.status(200).json({ reservation });
  } catch (error) {
    console.error("Error during reservation update:", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const checkIn = async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;

    const userId = req.user?.id;

    const reservation = await ReservationsModel.findOne({
      where: { id, userId },
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.status !== "reserved") {
      return res
        .status(400)
        .json({ message: "Reservation is not in the 'reserved' state" });
    }

    await ReservationsModel.update(
      { status: "in-residence" },
      { where: { id } }
    );

    const updatedReservation = await ReservationsModel.findByPk(id);

    return res.status(200).json({
      updatedReservation,
      message: "Check-in successful",
    });
  } catch (error: any) {
    console.error("Error Checking in Client:", error);
    return res
      .status(500)
      .json({ error: error.message || "Something went wrong" });
  }
};

export const checkOut = async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;

    const userId = req.user?.id;

    const reservation = await ReservationsModel.findOne({
      where: { id, userId },
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.status !== "in-residence") {
      return res
        .status(400)
        .json({ message: "Reservation is not in the 'In residence' state" });
    }

    await ReservationsModel.update({ status: "stayed" }, { where: { id } });

    const updatedReservation = await ReservationsModel.findByPk(id);

    return res.status(200).json({
      updatedReservation,
      message: "Check-out successful",
    });
  } catch (error: any) {
    console.error("Error Checking out Client:", error);
    return res
      .status(500)
      .json({ error: error.message || "Something went wrong" });
  }
};

export const cancell = async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;

    const userId = req.user?.id;

    const reservation = await ReservationsModel.findOne({
      where: { id, userId },
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.status !== "cancelled") {
      await ReservationsModel.update(
        { status: "cancelled" },
        { where: { id } }
      );

      const updatedReservation = await ReservationsModel.findByPk(id);

      return res.status(200).json({
        updatedReservation,
        message: "Reservation successfully cancelled",
      });
    } else {
      return res
        .status(400)
        .json({ message: "Reservation has already been cancelled" });
    }
  } catch (error: any) {
    console.error("Error Checking out Client:", error);
    return res
      .status(500)
      .json({ error: error.message || "Something went wrong" });
  }
};

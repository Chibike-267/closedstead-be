import cron from "node-cron";
import moment from "moment";
import { Op } from "sequelize";
import { NotificationsModel } from "./model";
import { UnitsModel } from "../units/model";
import { ReservationsModel } from "../reservations/model";
import { UsersModel } from "../users/model";

// Method to create notifications for reservations starting within the next 24 hours
const checkinNotifications = async () => {
	try {
		// Calculate the date and time for reservations starting within the next 24 hours
		const checkInDate = moment().add(24, "hours").toDate();

		// Find reservations starting within the next 24 hours
		const upcomingReservations = await ReservationsModel.findAll({
			where: {
				checkInDate: {
					[Op.between]: [moment().toDate(), checkInDate],
				},
			},
			include: [
				{
					model: UsersModel,
					attributes: ["name", "email", "phone"],
				},
				{
					model: UnitsModel,
					attributes: ["id"],
				},
			],
		});

		for (const reservation of upcomingReservations) {
			await NotificationsModel.create({
				customerName: reservation.customerName,
				customerEmail: reservation.customerEmail,
				customerPhone: reservation.customerPhone,
				checkInDate: reservation.checkInDate,
				checkOutDate: reservation.checkOutDate,
				userId: reservation.userId,
				unitId: reservation.unitId,
				reservationId: reservation.id,
				notificationStatus: "unseen",
			});
		}

		console.log("Notifications for starting reservations created successfully.");
	} catch (error) {
		console.error("Error creating notifications for starting reservations:", error);
	}
};

// Method to create notifications for reservations ending within the next 24 hours
const checkoutNotifications = async () => {
	try {
		// Calculate the date and time for reservations ending within the next 24 hours
		const checkOutDate = moment().add(24, "hours").toDate();

		// Find reservations ending within the next 24 hours
		const endingReservations = await ReservationsModel.findAll({
			where: {
				checkOutDate: {
					[Op.between]: [moment().toDate(), checkOutDate],
				},
			},
			include: [
				{
					model: UsersModel,
					attributes: ["name", "email", "phone"],
				},
				{
					model: UnitsModel,
					attributes: ["id"],
				},
			],
		});

		// Create notifications for each reservation
		for (const reservation of endingReservations) {
			await NotificationsModel.create({
				customerName: reservation.customerName,
				customerEmail: reservation.customerEmail,
				customerPhone: reservation.customerPhone,
				checkInDate: reservation.checkInDate,
				checkOutDate: reservation.checkOutDate,
				userId: reservation.userId,
				unitId: reservation.unitId,
				reservationId: reservation.id,
				notificationStatus: "unseen",
			});
		}

		console.log("Notifications for ending reservations created successfully.");
	} catch (error) {
		console.error("Error creating notifications for ending reservations:", error);
	}
};

// Schedule the cron jobs
cron.schedule("0 6 * * *", checkinNotifications);
cron.schedule("0 12 * * *", checkoutNotifications);

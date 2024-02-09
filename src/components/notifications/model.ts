import { Sequelize, DataTypes, Model } from "sequelize";
import db from "../../db";
import { UsersModel } from "../users/model";
import { UnitsModel } from "../units/model";
import { ReservationsModel } from "../reservations/model";

class NotificationsModel extends Model {
	public id!: string;
	public customerName!: string;
	public customerEmail!: string;
	public customerPhone!: string;
	public checkInDate!: Date;
	public checkOutDate!: Date;
	public userId!: string;
	public unitId!: string | null;
	public reservationId!: string | null;
	public notificationStatus!: "unseen" | "seen";
	public createdAt!: Date;
	public updatedAt!: Date;
}

NotificationsModel.init(
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
		},
		customerName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		customerEmail: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		customerPhone: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		checkInDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		checkOutDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		unitId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		reservationId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		notificationStatus: {
			type: DataTypes.ENUM("unseen", "seen"),
			defaultValue: "unseen",
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		sequelize: db,
		modelName: "NotificationsModel",
		tableName: "Notifications",
		timestamps: true,
	}
);

NotificationsModel.belongsTo(UsersModel, { foreignKey: "userId" });
NotificationsModel.belongsTo(ReservationsModel, { foreignKey: "reservationsId" });
UnitsModel.hasMany(NotificationsModel, { foreignKey: "unitId" });

export { db, NotificationsModel };

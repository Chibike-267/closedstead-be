import { Sequelize, DataTypes, Model } from "sequelize";
import db from "../../db";
import { UsersModel } from "../users/model";

class ReservationsModel extends Model {
  public id!: string;
  public customerName!: string;
  public customerEmail!: string;
  public customerPhone!: string;
  public checkInDate!: Date;
  public checkOutDate!: Date;
  public userId!: string;
  public unitId!: string;
  public status!: "cancelled" | "stayed" | "ongoing";
  public createdAt!: Date;
  public updatedAt!: Date;
}

ReservationsModel.init(
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
    status: {
      type: DataTypes.ENUM("cancelled", "stayed", "ongoing"),
      defaultValue: "ongoing",
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
    modelName: "ReservationsModel",
    tableName: "reservations",
    timestamps: true,
  }
);

ReservationsModel.belongsTo(UsersModel, { foreignKey: "userId" });

export { db, ReservationsModel };

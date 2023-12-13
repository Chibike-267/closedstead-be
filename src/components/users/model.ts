import { Sequelize, DataTypes, Model } from "sequelize";
import db from "../../db";

class UsersModel extends Model {
  public id!: string;
  public firstName!: string;
  public surname!: string;
  public email!: string;
  public password!: string;

  // Google-specific fields
  public googleId?: string;
  public googleAccessToken?: string;

  // Profile information
  public displayName?: string;
  public profilePicture?: string;

  // Authentication related
  public authProvider?: string;

  public createdAt?: Date;
  public updatedAt?: Date;
}

UsersModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    googleAccessToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    authProvider: {
      type: DataTypes.STRING,
      allowNull: true,
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
    modelName: "UsersModel",
    tableName: "users",
    timestamps: true,
  }
);

export { db, UsersModel };

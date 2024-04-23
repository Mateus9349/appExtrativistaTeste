import Sequelize, { Model } from "rn-sequelize";
import { sequelize } from "../source/database/sequelize";

export class Sale extends Model {}

Sale.init(
  {
    id: {
      type: Sequelize.UUIDV4,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    collectId: {
      type: Sequelize.UUIDV4,
      allowNull: false,
    },
    association: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    userIdCreated: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    sentToApi: {
      type: Sequelize.BOOLEAN,
    },
    saleValue: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    soldWeight: {
      type: Sequelize.FLOAT,
    },
    totalExpenses: {
      type: Sequelize.DOUBLE,
    },
    commission: {
      type: Sequelize.DOUBLE,
    },
    profit: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    created_at: {
      type: Sequelize.STRING,
    },
    updated_at: {
      type: Sequelize.STRING,
      defaultValue: null,
    },
    deleted_at: {
      type: Sequelize.STRING,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: "Sale",
    freezeTableName: true,
    timestamps: false,
  }
);

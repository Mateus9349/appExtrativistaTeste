import Sequelize, { Model } from "rn-sequelize";
import { sequelize } from "../source/database/sequelize";

export class Collect extends Model {}

export interface CollectInterface {
  id: string;
  feedstockId: string;
  team: string;
  foodExpenses: number;
  boatExpenses: number;
  rabetaExpenses: number;
  otherExpenses: number;
  balsaExpenses: number;
  materialPerDayExpenses: number;
  materialExpensesTotal: number;
  status: string;
  closedDate: string;
  created_at: string;
  userIdCreated: number;
}

Collect.init(
  {
    id: {
      type: Sequelize.UUIDV4,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    userIdCreated: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    feedstockId: {
      type: Sequelize.UUIDV4,
      allowNull: false,
    },
    team: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    foodExpenses: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    materialPerDayExpenses: {
      type: Sequelize.FLOAT,
    },
    materialExpensesTotal: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    boatExpenses: {
      type: Sequelize.FLOAT,
    },
    rabetaExpenses: {
      type: Sequelize.FLOAT,
    },
    otherExpenses: {
      type: Sequelize.FLOAT,
    },
    balsaExpenses: {
      type: Sequelize.FLOAT,
    },
    closedDate: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.ENUM("open", "closed", "sold"),
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
    modelName: "Collect",
    timestamps: false,
    freezeTableName: true,
  }
);

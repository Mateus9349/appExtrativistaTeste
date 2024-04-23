import Sequelize, { Model } from "rn-sequelize";
import { sequelize } from "../source/database/sequelize";

export class Sync extends Model {}

Sync.init(
  {
    id: {
      type: Sequelize.UUIDV4,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    lastSync: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    created_at: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize,
    modelName: "Sync",
    timestamps: false,
    freezeTableName: true,
  }
);

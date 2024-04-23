import Sequelize, { Model } from "rn-sequelize";
import { sequelize } from "../source/database/sequelize";
import { materialObject } from "../utils/materialsMockData";
import moment from "moment";

export class Materials extends Model {}

Materials.init(
  {
    id: {
      type: Sequelize.UUIDV4,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    unitPrice: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    lifespan: {
      type: Sequelize.INTEGER,
    },
    label: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    acquisition: {
      type: Sequelize.STRING,
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
    modelName: "Materials",
    freezeTableName: true,
    timestamps: false,
  }
);

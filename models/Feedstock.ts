import Sequelize, { Model } from "rn-sequelize";
import { sequelize } from "../source/database/sequelize";
import { feedstockData } from "../utils/feedstockData";
import moment from "moment";

export class Feedstock extends Model {}

export interface FeedstockInterface {
  id: string;
  name: string;
  standardMeasure: string;
  collectType: string;
  category: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

Feedstock.init(
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
    standardMeasure: {
      type: Sequelize.ENUM("quilos"),
    },
    collectType: {
      type: Sequelize.ENUM("local", "viagem"),
    },
    category: {
      type: Sequelize.ENUM("isolada", "grupo"),
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
    modelName: "Feedstock",
    freezeTableName: true,
    timestamps: false,
  }
);

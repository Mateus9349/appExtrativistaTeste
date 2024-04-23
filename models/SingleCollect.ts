import Sequelize, { Model } from "rn-sequelize";
import { sequelize } from "../source/database/sequelize";

export class SingleCollect extends Model {}

export interface SingleCollectType {
  id: string;
  collectId: string;
  feedstockId: string;
  quantity: number;
  coord: string;
  userIdCreated: number;
  isSingleTree?: boolean;
  amountOfTree?: number;
  treeHeight?: number;
  treeCircumference?: number;
  weatherConditions?: string;
  groundConditions?: string;
  observations?: string;
}

SingleCollect.init(
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
    feedstockId: {
      type: Sequelize.UUIDV4,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    coord: {
      type: Sequelize.STRING,
    },
    amountOfTree: {
      type: Sequelize.INTEGER,
    },
    treeHeight: {
      type: Sequelize.FLOAT,
    },
    treeCircumference: {
      type: Sequelize.FLOAT,
    },
    userIdCreated: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    weatherConditions: {
      type: Sequelize.ENUM("null", "seco", "chuvoso"),
      allowNull: true,
    },
    groundConditions: {
      type: Sequelize.ENUM("null", "seco", "umido", "alagado"),
      allowNull: true,
    },
    observations: {
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
    freezeTableName: true,
    modelName: "SingleCollect",
    timestamps: false,
  }
);

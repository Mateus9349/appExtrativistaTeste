import Sequelize, { Model } from "rn-sequelize";
import { sequelize } from "../source/database/sequelize";

export class MaterialInCollect extends Model {}

MaterialInCollect.init(
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
    materialId: {
      type: Sequelize.UUIDV4,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
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
    freezeTableName: true,
    modelName: "MaterialInCollect",
    timestamps: false,
  }
);

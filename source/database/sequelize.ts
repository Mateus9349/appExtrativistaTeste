import * as SQLite from "expo-sqlite";
import { Sequelize } from "rn-sequelize";

export const sequelize = new Sequelize({
  dialectModule: SQLite,
  database: "inatuDb",
  dialectOptions: {
    version: "1.0",
    description: "Database for the Inatu App",
  },
});

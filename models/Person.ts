import Sequelize, { Model } from "rn-sequelize";
import { sequelize } from "../source/database/sequelize";
import { helpersData } from "../utils/helpersMockData";
import moment from "moment";

export class Person extends Model {}

export interface PersonType {
  name: string;
  ssn: string;
  id: string;
  surname: string;
  birthDate: string;
  address: string;
}

Person.init(
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
    surname: {
      type: Sequelize.STRING,
    },
    ssn: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    birthDate: {
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
    modelName: "Person",
    freezeTableName: true,
    timestamps: false,
  }
);

// const insertDefaultValues = async () => {
//   console.log("EXECUTANDO FUNCAO MODELO");
//   helpersData.map(async (item) => {
//     console.log("NAMEEE- >", item.name);
//     await Person.findOrCreate({
//       where: {
//         name: item.name,
//       },
//       defaults: {
//         name: item.name,
//         surname: item.surname,
//         ssn: item.ssn,
//         address: item.address,
//         birthDate: item.birthDate,
//         created_at: moment(new Date()).toISOString(true),
//       },
//     });
//   });
// };

// insertDefaultValues();

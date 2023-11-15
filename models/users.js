"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
require("dotenv").config();

const saltRounds = process.env.SALTROUNDS;
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      this.hasMany(models.Products, {
        // OneToMany -> Users : Products
        sourceKey: "id",
        foreignKey: "userId",
      });
    }
  }
  Users.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        // ManyToOne -> Products:  Users
        targetKey: "id",
        foreignKey: "userId",
      });
    }
  }
  Products.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contents: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("FOR_SALE", "SOLD_OUT"),
        allowNull: false,
        defaultValue: "FOR_SALE",
      },
    },
    {
      sequelize,
      modelName: "Products",
    }
  );
  return Products;
};

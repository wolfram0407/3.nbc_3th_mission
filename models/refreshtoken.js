'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Refreshtoken extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        targetKey: 'id',
        foreignKey: 'userId',
      });
    }
  }
  Refreshtoken.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      refrshtoken: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Refreshtoken',
    }
  );
  return Refreshtoken;
};

const Sequelize = require('sequelize');
const sequelize = require('../config/db.config');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('subscription_plans', {
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    plan_type: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    payment_id: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    payment_method: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    sub_date: {
      type: DataTypes.DATETIME,
      allowNull: true,
    },
  },
    {
      sequelize,
      tableName: 'images',
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "plan_id" },
          ]
        }
      ]
    });
};
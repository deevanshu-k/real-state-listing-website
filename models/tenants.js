const Sequelize = require('sequelize');
const sequelize = require('../config/db.config');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('tenants', {
    tenant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: 1
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    password: {
      type: DataTypes.MEDIUMTEXT,
      allowNull: true
    },
    profile_img: {
      type: DataTypes.TINYTEXT,
      allowNull: true
    },
    document_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      refrences: {
        model: subscription_plan,
        key: 'plan_id'
    }
    },
    address: {
      type: DataTypes.MEDIUMTEXT,
      allowNull: true
    },
    verification_status: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
    {
      sequelize,
      tableName: 'tenants',
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "tenant_id" },
          ]
        },
        {
          name: "fk_tenants_subscription_plan1",
          using: "BTREE",
          fields: [
            { name: "plan_id" },
          ]
        },
      ]
    });
};

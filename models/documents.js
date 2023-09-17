const Sequelize = require('sequelize');
const sequelize = require('../config/db.config');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('documents', {
    document_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    object_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      refrences: {
        model: landlords, tenants,
        key: 'document_id'
    }
    }
  },
    {
      sequelize,
      tableName: 'documents',
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "document_id" },
          ]
        },
        {
          name: "object_id_UNIQUE",
          using: "BTREE",
          fields: [
            { name: "object_id" },
          ]
        },
      ]
    });
};
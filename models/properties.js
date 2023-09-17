const Sequelize = require('sequelize');
const sequelize = require('../config/db.config');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('properties', {
        property_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        landlord_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
              model: landlords,
              key: 'landlord_id',
        }
      }
    },
    {
        sequelize,
        tableName: 'properties',
        timestamps: true,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [
              { name: "properties_id" },
            ]
          },
          {
            name: "landlord_to_properties",
            using: "BTREE",
            fields: [
              { name: "landlord_id" },
            ]
          },
        ]
    });
    
};
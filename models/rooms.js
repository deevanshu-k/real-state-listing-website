const Sequelize = require('sequelize');
const sequelize = require('../config/db.config');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('rooms', {
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    property_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      refrences: {
        model: properties,
        key: 'property_id'
    }
    },
    room_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    verification_status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    district: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    zipcode: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    remark: {
      type: DataTypes.LONGTEXT,
      allowNull: false
    },
    no_of_rooms: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    attached_kitchen: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    attached_bathroom: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    indlude_water_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    indlude_electricity_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
    {
      sequelize,
      tableName: 'rooms',
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "room_id" },
          ]
        },
        {
          name: "property_to_rooms_idx",
          using: "BTREE",
          fields: [
            { name: "property_id" },
          ]
        },
      ]
    });
};

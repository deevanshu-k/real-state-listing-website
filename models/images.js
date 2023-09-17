const Sequelize = require('sequelize');
const sequelize = require('../config/db.config');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('images', {
    images_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      refrences: {
        model: rooms,
        key: 'room_id'
    }
    }
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
            { name: "images_id" },
          ]
        },
        {
          name: "room_to_images_idx",
          using: "BTREE",
          fields: [
            { name: "room_id" },
          ]
        },
      ]
    });
};
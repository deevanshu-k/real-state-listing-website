const Sequelize = require('sequelize');
const sequelize = require('../config/db.config');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('admins', {
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    password: {
      type: DataTypes.MEDIUMTEXT,
      allowNull: true
    },
    profile_image: {
      type: DataTypes.TINYTEXT,
      allowNull: true
    }
  },
    {
      sequelize,
      tableName: 'admins',
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "room_id" },
          ]
        }
      ]
    });
};
const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('room_image', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        roomId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        img_url: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    },
        {
            timestamps: false,
        });
};

const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('room', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        propertyId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        room_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        verification_status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false
        },
        state: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        district: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        zipcode: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        remark: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        no_of_rooms: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        attached_kitchen: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        attached_bathroom: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        include_water_price: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        include_electricity_price: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    });
};

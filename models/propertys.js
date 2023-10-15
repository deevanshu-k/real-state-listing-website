const Sequelize = require('sequelize');

/*
 property_type: [HOUSE,ROOM,FLAT,COMMERTIAL_SPACE]
*/
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('property', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        landlordId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        property_type: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        property_name: {
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

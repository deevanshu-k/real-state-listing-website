const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('tenant', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        phone_no: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        key: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        profile_image: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        verification_status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false
        },
        verified_email: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
        {
            timestamps: false
        });
};

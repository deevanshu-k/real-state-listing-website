const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('property', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        property_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        landlordId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
        {
            timestamps: false
        });
};

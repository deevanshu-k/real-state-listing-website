const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('document', {
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
        tenantId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        type: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        document_url: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        key: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    },
        {
            timestamps: false,
        });
};

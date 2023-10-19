const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('admin', {
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
        }
    },
        {
            timestamps: false
        });
};

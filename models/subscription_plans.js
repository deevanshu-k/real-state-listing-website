const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('subscription_plan', {
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
        plan_type: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        payment_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        order_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        payment_method: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        exp_date: {
            type: "TIMESTAMP",
            allowNull: true,
        },
        sub_date: {
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
        {
            timestamps: false,
        }
    );
};

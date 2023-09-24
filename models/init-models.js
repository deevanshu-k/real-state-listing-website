let DataTypes = require("sequelize").DataTypes;
const _landlords = require('./landlords');
const _tenant = require('./tenants');
const _property = require('./propertys');
const _subscription_plan = require('./subscription_plans');
const _room = require('./rooms');
const _room_image = require('./room_images');
const _document = require('./documents');
const _admin = require('./admins');


function initModels(sequelize) {
    let landlord = _landlords(sequelize, DataTypes);
    let tenant = _tenant(sequelize, DataTypes);
    let property = _property(sequelize, DataTypes);
    let subscription_plan = _subscription_plan(sequelize, DataTypes);
    let room = _room(sequelize, DataTypes);
    let room_image = _room_image(sequelize, DataTypes);
    let document = _document(sequelize, DataTypes);
    let admin = _admin(sequelize, DataTypes);

    landlord.hasMany(property, { as: "properties" });
    property.belongsTo(landlord, {
        foreignKey: "landlordId",
        as: "landlord",
    });

    landlord.hasMany(document, { as: 'documents' });
    document.belongsTo(landlord, {
        foreignKey: "landlordId",
        as: "landlord"
    });

    tenant.hasMany(document, { as: 'documents' });
    document.belongsTo(tenant, {
        foreignKey: "tenantId",
        as: "tenant"
    });

    subscription_plan.hasOne(landlord, { as: "landlord" });
    subscription_plan.hasOne(tenant, { as: "tenant" });
    landlord.belongsTo(subscription_plan, {
        foreignKey: "plan_id",
        as: "subscription_plan"
    });
    tenant.belongsTo(subscription_plan, {
        foreignKey: "plan_id",
        as: "subscription_plan"
    });

    property.hasMany(room, { as: "rooms" });
    room.belongsTo(property, {
        foreignKey: "propertyId",
        as: "property"
    });

    room.hasMany(room_image, { as: "images" });
    room_image.belongsTo(room, {
        foreignKey: "roomId",
        as: "room"
    })

    return {
        landlord,
        property,
        subscription_plan,
        room,
        room_image,
        document,
        tenant,
        admin
    }
}

module.exports = { initModels };
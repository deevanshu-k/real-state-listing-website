let DataTypes = require("sequelize").DataTypes;
const _landlords = require('./landlords');
const _tenant = require('./tenants');
const _property = require('./propertys');
const _subscription_plan = require('./subscription_plans');
const _property_image = require('./property_images');
const _document = require('./documents');
const _admin = require('./admins');


function initModels(sequelize) {
    let landlord = _landlords(sequelize, DataTypes);
    let tenant = _tenant(sequelize, DataTypes);
    let property = _property(sequelize, DataTypes);
    let subscription_plan = _subscription_plan(sequelize, DataTypes);
    let property_image = _property_image(sequelize, DataTypes);
    let document = _document(sequelize, DataTypes);
    let admin = _admin(sequelize, DataTypes);

    // PROPERTIES
    landlord.hasMany(property, { as: "propertys" });
    property.belongsTo(landlord, {
        foreignKey: "landlordId",
        as: "landlord",
    });

    // DOCUMENTS
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

    // SUBSCRIPTION PLANS
    tenant.hasMany(subscription_plan, { as: 'subscription_plans' });
    subscription_plan.belongsTo(tenant, {
        foreignKey: "tenantId",
        as: "tenant"
    });

    landlord.hasMany(subscription_plan, { as: 'subscription_plans' });
    subscription_plan.belongsTo(landlord, {
        foreignKey: "landlordId",
        as: "landlord"
    });

    // PROPERTY IMAGES
    property.hasMany(property_image, { as: "images" });
    property_image.belongsTo(property, {
        foreignKey: "propertyId",
        as: "property"
    })

    return {
        landlord,
        subscription_plan,
        property,
        property_image,
        document,
        tenant,
        admin
    }
}

module.exports = { initModels };


let paymentHelper = {};

paymentHelper.createReceipt = (userType,userId) => {
    return ("receipt_"+String(userType).toLowerCase()+userId);
}

module.exports = paymentHelper;
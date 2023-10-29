const NodeCache = require("node-cache");
const _nodecache = new NodeCache();

let passwordHelper = {}

// Cache Token And User Object
passwordHelper.cachePswdResetToken = (token, obj) => {
    try {
        _nodecache.set(token, obj, process.env.RESET_PSWD_TOKEN_EXP_TIME);
        return true;
    } catch (error) {
        return false;
    }
};

// Return Obj
passwordHelper.getUserObj = (token) => {
    let obj = _nodecache.get(token);
    _nodecache.del(token);
    return obj;
}

module.exports = passwordHelper;
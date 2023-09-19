const otpGenerator = require('otp-generator');
const NodeCache = require( "node-cache" );
const _nodecache = new NodeCache();

let otpHelper = {}

// Generate random otp and save it in cache
otpHelper.createOtpAndCacheOtp = (email,length) => {
    let otp = otpGenerator.generate(length,{digits:true,lowerCaseAlphabets:false,specialChars:false,upperCaseAlphabets:false});
    _nodecache.set(email,otp,120);
    return otp;
};

// Check If otp is equal to cache email otp
otpHelper.isOtpEqualCacheOtp = (email,otp) => {
    let cacheOtp = _nodecache.get(email);
    return (cacheOtp == otp);
}

module.exports = otpHelper;
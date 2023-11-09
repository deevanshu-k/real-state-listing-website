const rateLimit  = require("express-rate-limit");
const Constant = require("../config/constant");
let rateLimiter = {};

rateLimiter.loginRouteRateLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 min
	limit: 50, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	message: async (req,res) => {
		return res.status(Constant.FORBIDDEN_CODE).json({
			code: Constant.FORBIDDEN_CODE,
			message: Constant.LOGIN_LIMIT_REACHED
		});
	}
	// store: ... , // Use an external store for more precise rate limiting
});

rateLimiter.paymentRouteRateLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 min
	limit: 40, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	message: async (req,res) => {
		return res.status(Constant.FORBIDDEN_CODE).json({
			code: Constant.FORBIDDEN_CODE,
			message: Constant.LOGIN_LIMIT_REACHED
		});
	}
	// store: ... , // Use an external store for more precise rate limiting
});

rateLimiter.landlordOperationsRouteRateLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 min
	limit: 50, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	message: async (req,res) => {
		return res.status(Constant.FORBIDDEN_CODE).json({
			code: Constant.FORBIDDEN_CODE,
			message: Constant.LOGIN_LIMIT_REACHED
		});
	}
	// store: ... , // Use an external store for more precise rate limiting
});

rateLimiter.commonOperationsRouteRateLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 min
	limit: 50, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	message: async (req,res) => {
		return res.status(Constant.FORBIDDEN_CODE).json({
			code: Constant.FORBIDDEN_CODE,
			message: Constant.LOGIN_LIMIT_REACHED
		});
	}
	// store: ... , // Use an external store for more precise rate limiting
});

module.exports = rateLimiter;
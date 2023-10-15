module.exports = {
    SUCCESS_CODE: 200,
    CREATED: 201,
    REQ_DATING_ERROR_CODE: 204,
    BAD_REQUEST: 400,
    INVALID_CODE: 401,
    FORBIDDEN_CODE: 403,
    INACTIVATE: 406,
    NOT_FOUND: 404,
    CONFLICT: 409,
    SERVER_ERROR: 500,

    SOMETHING_WENT_WRONG: 'Something went wrong, try after some time!',
    REQUEST_BAD_REQUEST: "Bad request!",
    REQUEST_SERVER_ERROR: "Server error!",
    REQUEST_NOT_FOUND: "Route not found!",
    EMAIL_ALREADY_REGISTERED: 'Email already registered.',
    USER_LOGIN_SUCCESS: 'User Login successfully',
    USER_EMAIL_PASSWORD: "You have entered an invalid email or password",
    SAVE_SUCCESS: 'Requested record created successfully',
    VERIFY_EMAIL: 'Verify your email',
    VERIFIED_SUCCESSFULLY: 'Email verified successfully',
    USER_TOKEN_EXPIRED: 'Your section is expired, Login again',
    USER_TOKEN_NOTFOUND: 'You are not logged in, Login now',
    LOGIN_LIMIT_REACHED: 'Too many login request, try after some time!',
    UNAUTHORIZED_REQUEST: 'Unauthorized request !',

    PLANS: {
        "PREMIUMTENANT": {
            type: "PREMIUMTENANT",
            amount: 599
        },
        "FREELANDLORD": {
            type: "FREELANDLORD",
            amount: 0,
            duration: 7,
            room: 1
        },
        "STANDARDLANDLORD": {
            type: "STANDARDLANDLORD",
            amount: 799,
            duration: 90,
            room: 5
        },
        "PREMIUMLANDLORD": {
            type: "PREMIUMLANDLORD",
            amount: 1499,
            duration: 180,
            room: Number.POSITIVE_INFINITY
        }
    },
    PROPERTY_TYPE: ['ROOM','HOME', 'FLAT', 'COMMERTIAL_SPACE']
}
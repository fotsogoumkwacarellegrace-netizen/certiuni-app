"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorResponse = exports.sendSuccessResponse = exports.formatErrorResponse = exports.formatSuccessResponse = void 0;
const formatSuccessResponse = (data, message = 'Success') => {
    return {
        status: 'success',
        message,
        data,
        timestamp: new Date().toISOString(),
    };
};
exports.formatSuccessResponse = formatSuccessResponse;
const formatErrorResponse = (message, errors, statusCode = 400) => {
    return {
        status: statusCode >= 500 ? 'error' : 'fail',
        message,
        errors,
        timestamp: new Date().toISOString(),
    };
};
exports.formatErrorResponse = formatErrorResponse;
const sendSuccessResponse = (res, statusCode, data, message = 'Success') => {
    return res.status(statusCode).json((0, exports.formatSuccessResponse)(data, message));
};
exports.sendSuccessResponse = sendSuccessResponse;
const sendErrorResponse = (res, statusCode, message, errors) => {
    return res.status(statusCode).json((0, exports.formatErrorResponse)(message, errors, statusCode));
};
exports.sendErrorResponse = sendErrorResponse;
//# sourceMappingURL=responseFormatter.js.map
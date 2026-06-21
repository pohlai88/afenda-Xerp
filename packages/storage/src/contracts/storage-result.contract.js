"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStorageFailure = createStorageFailure;
exports.createStorageSuccess = createStorageSuccess;
function createStorageFailure(status, message) {
    return {
        error: {
            code: status,
            message: message,
        },
        status: status,
    };
}
function createStorageSuccess(value) {
    return {
        status: "success",
        value: value,
    };
}

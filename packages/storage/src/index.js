"use strict";
// biome-ignore-all lint/performance/noBarrelFile: package root is the curated public API surface.
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageService = exports.createStorageService = exports.createR2StorageProvider = exports.createBlobStorageProvider = exports.createStorageSuccess = exports.createStorageFailure = exports.STORAGE_ERROR_CODES = exports.PACKAGE_NAME = void 0;
exports.getPackageName = getPackageName;
exports.PACKAGE_NAME = "@afenda/storage";
function getPackageName() {
    return exports.PACKAGE_NAME;
}
var storage_error_contract_js_1 = require("./contracts/storage-error.contract.js");
Object.defineProperty(exports, "STORAGE_ERROR_CODES", { enumerable: true, get: function () { return storage_error_contract_js_1.STORAGE_ERROR_CODES; } });
var storage_result_contract_js_1 = require("./contracts/storage-result.contract.js");
Object.defineProperty(exports, "createStorageFailure", { enumerable: true, get: function () { return storage_result_contract_js_1.createStorageFailure; } });
Object.defineProperty(exports, "createStorageSuccess", { enumerable: true, get: function () { return storage_result_contract_js_1.createStorageSuccess; } });
var blob_provider_js_1 = require("./providers/blob.provider.js");
Object.defineProperty(exports, "createBlobStorageProvider", { enumerable: true, get: function () { return blob_provider_js_1.createBlobStorageProvider; } });
var r2_provider_js_1 = require("./providers/r2.provider.js");
Object.defineProperty(exports, "createR2StorageProvider", { enumerable: true, get: function () { return r2_provider_js_1.createR2StorageProvider; } });
var storage_service_js_1 = require("./services/storage.service.js");
Object.defineProperty(exports, "createStorageService", { enumerable: true, get: function () { return storage_service_js_1.createStorageService; } });
Object.defineProperty(exports, "storageService", { enumerable: true, get: function () { return storage_service_js_1.storageService; } });

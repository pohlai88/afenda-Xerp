"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlobStorageProvider = createBlobStorageProvider;
var r2_provider_js_1 = require("./r2.provider.js");
function createBlobStorageProvider(options) {
    return (0, r2_provider_js_1.createStorageProviderForProviderId)("blob", options);
}

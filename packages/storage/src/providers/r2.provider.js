"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStorageProviderForProviderId = createStorageProviderForProviderId;
exports.createR2StorageProvider = createR2StorageProvider;
var storage_result_contract_js_1 = require("../contracts/storage-result.contract.js");
var signature_js_1 = require("./signature.js");
function createStorageProviderForProviderId(providerId, options) {
    var objects = new Map();
    return {
        providerId: providerId,
        createObject: function (input) {
            if (input.bucket !== options.bucket) {
                return Promise.resolve((0, storage_result_contract_js_1.createStorageFailure)("access_denied", "Bucket is not allowed."));
            }
            var object = {
                bucket: input.bucket,
                checksum: input.checksum,
                companyId: input.companyId,
                createdAt: new Date().toISOString(),
                filename: input.filename,
                metadata: input.metadata,
                mimeType: input.mimeType,
                objectId: input.objectId,
                organizationId: input.organizationId,
                path: input.path,
                provider: providerId,
                size: input.size,
                tenantId: input.tenantId,
            };
            objects.set(input.objectId, object);
            return Promise.resolve((0, storage_result_contract_js_1.createStorageSuccess)(object));
        },
        deleteObject: function (input) {
            var existingObject = objects.get(input.objectId);
            if (!existingObject || existingObject.tenantId !== input.tenantId) {
                return Promise.resolve((0, storage_result_contract_js_1.createStorageFailure)("not_found", "Storage object was not found."));
            }
            objects.delete(input.objectId);
            return Promise.resolve((0, storage_result_contract_js_1.createStorageSuccess)(null));
        },
        generateDownloadUrl: function (input) {
            var existingObject = objects.get(input.objectId);
            if (!existingObject || existingObject.tenantId !== input.tenantId) {
                return Promise.resolve((0, storage_result_contract_js_1.createStorageFailure)("not_found", "Storage object was not found."));
            }
            return Promise.resolve((0, storage_result_contract_js_1.createStorageSuccess)({
                expiresAt: input.expiresAt,
                headers: {},
                method: "GET",
                objectId: input.objectId,
                url: (0, signature_js_1.createSignedStorageUrl)({
                    baseUrl: options.baseUrl,
                    expiresAt: input.expiresAt,
                    method: "GET",
                    objectId: input.objectId,
                    path: existingObject.path,
                    signingSecret: options.signingSecret,
                    tenantId: input.tenantId,
                }),
            }));
        },
        generateUploadUrl: function (input) {
            if (input.bucket !== options.bucket) {
                return Promise.resolve((0, storage_result_contract_js_1.createStorageFailure)("access_denied", "Bucket is not allowed."));
            }
            var objectId = (0, signature_js_1.createStorageObjectId)();
            return Promise.resolve((0, storage_result_contract_js_1.createStorageSuccess)({
                expiresAt: input.expiresAt,
                headers: {
                    "content-type": input.mimeType,
                },
                method: "PUT",
                objectId: objectId,
                url: (0, signature_js_1.createSignedStorageUrl)({
                    baseUrl: options.baseUrl,
                    expiresAt: input.expiresAt,
                    method: "PUT",
                    objectId: objectId,
                    path: input.path,
                    signingSecret: options.signingSecret,
                    tenantId: input.tenantId,
                }),
            }));
        },
        getObject: function (input) {
            var existingObject = objects.get(input.objectId);
            if (!existingObject || existingObject.tenantId !== input.tenantId) {
                return Promise.resolve((0, storage_result_contract_js_1.createStorageFailure)("not_found", "Storage object was not found."));
            }
            return Promise.resolve((0, storage_result_contract_js_1.createStorageSuccess)(existingObject));
        },
        healthCheck: function () {
            return Promise.resolve((0, storage_result_contract_js_1.createStorageSuccess)({
                checkedAt: new Date().toISOString(),
                provider: providerId,
                status: "healthy",
            }));
        },
    };
}
function createR2StorageProvider(options) {
    return createStorageProviderForProviderId("r2", options);
}

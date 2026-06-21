"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var index_js_1 = require("../index.js");
var storageObject = {
    bucket: "tenant-files",
    checksum: {
        algorithm: "sha256",
        value: "checksum",
    },
    companyId: "company-1",
    createdAt: "2026-06-20T00:00:00.000Z",
    filename: "invoice.pdf",
    metadata: {
        source: "test",
    },
    mimeType: "application/pdf",
    objectId: "object-1",
    organizationId: "organization-1",
    path: "tenant-1/invoice.pdf",
    provider: "r2",
    size: 128,
    tenantId: "tenant-1",
};
(0, vitest_1.describe)("storage service", function () {
    (0, vitest_1.it)("returns provider_unavailable before a provider is configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, index_js_1.storageService.healthCheck()];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.status).toBe("provider_unavailable");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("delegates storage operations to the configured provider", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider, service;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    provider = {
                        providerId: "r2",
                        createObject: function () {
                            return Promise.resolve((0, index_js_1.createStorageSuccess)(storageObject));
                        },
                        deleteObject: function () {
                            return Promise.resolve((0, index_js_1.createStorageSuccess)(null));
                        },
                        generateDownloadUrl: function () {
                            return Promise.resolve((0, index_js_1.createStorageSuccess)({
                                expiresAt: "2026-06-20T01:00:00.000Z",
                                headers: {},
                                method: "GET",
                                objectId: storageObject.objectId,
                                url: "https://storage.example/download",
                            }));
                        },
                        generateUploadUrl: function () {
                            return Promise.resolve((0, index_js_1.createStorageSuccess)({
                                expiresAt: "2026-06-20T01:00:00.000Z",
                                headers: {
                                    "content-type": storageObject.mimeType,
                                },
                                method: "PUT",
                                objectId: storageObject.objectId,
                                url: "https://storage.example/upload",
                            }));
                        },
                        getObject: function () {
                            return Promise.resolve((0, index_js_1.createStorageSuccess)(storageObject));
                        },
                        healthCheck: function () {
                            return Promise.resolve((0, index_js_1.createStorageSuccess)({
                                checkedAt: "2026-06-20T00:00:00.000Z",
                                provider: "r2",
                                status: "healthy",
                            }));
                        },
                    };
                    service = (0, index_js_1.createStorageService)(provider);
                    return [4 /*yield*/, (0, vitest_1.expect)(service.createObject({
                            bucket: storageObject.bucket,
                            checksum: storageObject.checksum,
                            companyId: storageObject.companyId,
                            filename: storageObject.filename,
                            metadata: storageObject.metadata,
                            mimeType: storageObject.mimeType,
                            objectId: storageObject.objectId,
                            organizationId: storageObject.organizationId,
                            path: storageObject.path,
                            size: storageObject.size,
                            tenantId: storageObject.tenantId,
                        })).resolves.toEqual((0, index_js_1.createStorageSuccess)(storageObject))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("normalizes thrown provider errors into provider_unavailable", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider, service, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    provider = {
                        providerId: "r2",
                        createObject: function () {
                            return Promise.reject(new Error("provider failed"));
                        },
                        deleteObject: function () {
                            return Promise.resolve((0, index_js_1.createStorageFailure)("not_found", "Storage object was not found."));
                        },
                        generateDownloadUrl: function () {
                            return Promise.resolve((0, index_js_1.createStorageFailure)("not_found", "Storage object was not found."));
                        },
                        generateUploadUrl: function () {
                            return Promise.resolve((0, index_js_1.createStorageFailure)("provider_unavailable", "Provider unavailable."));
                        },
                        getObject: function () {
                            return Promise.resolve((0, index_js_1.createStorageFailure)("not_found", "Storage object was not found."));
                        },
                        healthCheck: function () {
                            return Promise.resolve((0, index_js_1.createStorageFailure)("provider_unavailable", "Provider unavailable."));
                        },
                    };
                    service = (0, index_js_1.createStorageService)(provider);
                    return [4 /*yield*/, service.createObject({
                            bucket: storageObject.bucket,
                            checksum: storageObject.checksum,
                            companyId: storageObject.companyId,
                            filename: storageObject.filename,
                            metadata: storageObject.metadata,
                            mimeType: storageObject.mimeType,
                            objectId: storageObject.objectId,
                            organizationId: storageObject.organizationId,
                            path: storageObject.path,
                            size: storageObject.size,
                            tenantId: storageObject.tenantId,
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toEqual((0, index_js_1.createStorageFailure)("provider_unavailable", "provider failed"));
                    return [2 /*return*/];
            }
        });
    }); });
});

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
(0, vitest_1.describe)("storage provider adapters", function () {
    (0, vitest_1.it)("generates signed upload URLs without exposing unsigned object paths", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider, result, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    provider = (0, index_js_1.createR2StorageProvider)({
                        baseUrl: "https://storage.example/signed",
                        bucket: "tenant-files",
                        signingSecret: "test-secret",
                    });
                    return [4 /*yield*/, provider.generateUploadUrl({
                            bucket: "tenant-files",
                            companyId: "company-1",
                            expiresAt: "2026-06-20T01:00:00.000Z",
                            filename: "invoice.pdf",
                            mimeType: "application/pdf",
                            organizationId: "organization-1",
                            path: "tenant-1/invoice.pdf",
                            size: 128,
                            tenantId: "tenant-1",
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.status).toBe("success");
                    if (result.status !== "success") {
                        return [2 /*return*/];
                    }
                    url = new URL(result.value.url);
                    (0, vitest_1.expect)(result.value.method).toBe("PUT");
                    (0, vitest_1.expect)(url.searchParams.get("signature")).toHaveLength(64);
                    (0, vitest_1.expect)(url.searchParams.get("tenantId")).toBe("tenant-1");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("stores and retrieves object metadata through provider boundaries", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider, createResult, getResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    provider = (0, index_js_1.createBlobStorageProvider)({
                        baseUrl: "https://blob.example/signed",
                        bucket: "tenant-files",
                        signingSecret: "test-secret",
                    });
                    return [4 /*yield*/, provider.createObject({
                            bucket: "tenant-files",
                            checksum: null,
                            companyId: null,
                            filename: "avatar.png",
                            metadata: {},
                            mimeType: "image/png",
                            objectId: "object-1",
                            organizationId: null,
                            path: "tenant-1/avatar.png",
                            size: 32,
                            tenantId: "tenant-1",
                        })];
                case 1:
                    createResult = _a.sent();
                    (0, vitest_1.expect)(createResult.status).toBe("success");
                    return [4 /*yield*/, provider.getObject({
                            objectId: "object-1",
                            tenantId: "tenant-1",
                        })];
                case 2:
                    getResult = _a.sent();
                    (0, vitest_1.expect)(getResult.status).toBe("success");
                    if (getResult.status !== "success") {
                        return [2 /*return*/];
                    }
                    (0, vitest_1.expect)(getResult.value.provider).toBe("blob");
                    return [2 /*return*/];
            }
        });
    }); });
});

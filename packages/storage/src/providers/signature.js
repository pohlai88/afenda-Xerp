"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStorageObjectId = createStorageObjectId;
exports.createSignedStorageUrl = createSignedStorageUrl;
var node_crypto_1 = require("node:crypto");
var SIGNED_URL_VERSION = "1";
function normalizeBaseUrl(baseUrl) {
    return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}
function normalizePath(path) {
    return path.startsWith("/") ? path.slice(1) : path;
}
function createStorageObjectId() {
    return (0, node_crypto_1.randomUUID)();
}
function createSignedStorageUrl(options) {
    var canonicalPath = normalizePath(options.path);
    var payload = [
        SIGNED_URL_VERSION,
        options.method,
        options.tenantId,
        options.objectId,
        canonicalPath,
        options.expiresAt,
    ].join("\n");
    var signature = (0, node_crypto_1.createHmac)("sha256", options.signingSecret)
        .update(payload)
        .digest("hex");
    var url = new URL("".concat(normalizeBaseUrl(options.baseUrl), "/").concat(encodeURIComponent(canonicalPath)));
    url.searchParams.set("expiresAt", options.expiresAt);
    url.searchParams.set("objectId", options.objectId);
    url.searchParams.set("signature", signature);
    url.searchParams.set("tenantId", options.tenantId);
    url.searchParams.set("version", SIGNED_URL_VERSION);
    return url.toString();
}

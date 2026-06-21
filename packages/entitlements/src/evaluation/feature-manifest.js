"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.featureManifests = void 0;
exports.featureManifests = [
    {
        moduleId: "accounting",
        requiredEntitlements: ["module.accounting.enabled"],
        optionalCapabilities: ["eInvoice", "auditExport"],
    },
    {
        moduleId: "mrp",
        requiredEntitlements: ["module.mrp.enabled"],
        optionalCapabilities: ["lotTracking", "forecasting"],
    },
    {
        moduleId: "ai_copilot",
        requiredEntitlements: ["module.ai_copilot.enabled"],
        optionalCapabilities: ["aiRecommendations"],
    },
];

"use strict";
/** Platform kernel and shared contracts — placeholder export for TIP-001 foundation. */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXECUTION_CONTEXT_SOURCES = exports.createExecutionId = exports.createExecutionContext = exports.assertExecutionContext = exports.PACKAGE_NAME = void 0;
exports.getPackageName = getPackageName;
exports.PACKAGE_NAME = "@afenda/kernel";
function getPackageName() {
    return exports.PACKAGE_NAME;
}
var execution_context_contract_js_1 = require("./contracts/execution-context.contract.js");
Object.defineProperty(exports, "assertExecutionContext", { enumerable: true, get: function () { return execution_context_contract_js_1.assertExecutionContext; } });
Object.defineProperty(exports, "createExecutionContext", { enumerable: true, get: function () { return execution_context_contract_js_1.createExecutionContext; } });
Object.defineProperty(exports, "createExecutionId", { enumerable: true, get: function () { return execution_context_contract_js_1.createExecutionId; } });
Object.defineProperty(exports, "EXECUTION_CONTEXT_SOURCES", { enumerable: true, get: function () { return execution_context_contract_js_1.EXECUTION_CONTEXT_SOURCES; } });

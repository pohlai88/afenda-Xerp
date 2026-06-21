"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var index_1 = require("../index");
(0, vitest_1.describe)("@afenda/kernel", function () {
    (0, vitest_1.it)("exports the package name", function () {
        (0, vitest_1.expect)(index_1.PACKAGE_NAME).toBe("@afenda/kernel");
        (0, vitest_1.expect)((0, index_1.getPackageName)()).toBe("@afenda/kernel");
    });
});

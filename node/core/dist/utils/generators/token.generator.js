"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
const crypto = require("crypto");
function generateToken() {
    return crypto.randomUUID().replace(/-/g, '');
}
//# sourceMappingURL=token.generator.js.map
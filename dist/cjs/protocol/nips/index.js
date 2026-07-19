"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptNip44 = exports.encryptNip44 = void 0;
__exportStar(require("./nip01.js"), exports);
__exportStar(require("./nip04.js"), exports);
var nip44_js_1 = require("../../nips/nip44.js");
Object.defineProperty(exports, "encryptNip44", { enumerable: true, get: function () { return nip44_js_1.encryptNip44; } });
Object.defineProperty(exports, "decryptNip44", { enumerable: true, get: function () { return nip44_js_1.decryptNip44; } });
//# sourceMappingURL=index.js.map
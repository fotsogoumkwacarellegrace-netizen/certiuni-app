"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQrCodeDataUrl = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const generateQrCodeDataUrl = async (url) => {
    return await qrcode_1.default.toDataURL(url, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300,
        color: {
            dark: '#0F172A',
            light: '#FFFFFF',
        },
    });
};
exports.generateQrCodeDataUrl = generateQrCodeDataUrl;
//# sourceMappingURL=qr.service.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBatchFile = void 0;
const multer_1 = __importDefault(require("multer"));
const app_error_1 = require("../errors/app.error");
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    if (allowedMimeTypes.includes(file.mimetype) || file.originalname.match(/\.(csv|xlsx|xls)$/)) {
        cb(null, true);
    }
    else {
        cb(new app_error_1.BadRequestError('Seuls les fichiers au format CSV ou Excel (.xlsx, .xls) sont autorisés.'));
    }
};
exports.uploadBatchFile = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
}).single('file');
//# sourceMappingURL=upload.middleware.js.map
import multer from 'multer';
import { BadRequestError } from '../errors/app.error';

const storage = multer.memoryStorage();

const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedMimeTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (allowedMimeTypes.includes(file.mimetype) || file.originalname.match(/\.(csv|xlsx|xls)$/)) {
        cb(null, true);
    } else {
        cb(new BadRequestError('Seuls les fichiers au format CSV ou Excel (.xlsx, .xls) sont autorisés.'));
    }
};

export const uploadBatchFile = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // Limite fixée à 10 Mo
    },
}).single('file');
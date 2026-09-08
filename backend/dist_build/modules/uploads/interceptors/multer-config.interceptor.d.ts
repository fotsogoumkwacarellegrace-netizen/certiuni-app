export declare const multerOptions: {
    storage: import("multer").StorageEngine;
    limits: {
        fileSize: number;
    };
    fileFilter: (req: any, file: Express.Multer.File, callback: any) => void;
};

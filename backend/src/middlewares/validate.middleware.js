"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const validateRequest = (targetSchema) => {
    return async (req, res, next) => {
        try {
            if ('parseAsync' in targetSchema) {
                req.body = await targetSchema.parseAsync(req.body);
                return next();
            }
            const targets = targetSchema;
            if (targets.body) {
                req.body = await targets.body.parseAsync(req.body);
            }
            if (targets.query) {
                req.query = await targets.query.parseAsync(req.query);
            }
            if (targets.params) {
                req.params = await targets.params.parseAsync(req.params);
            }
            return next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const formattedErrors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                res.status(400).json({
                    status: 'fail',
                    message: 'Données de requête invalides.',
                    errors: formattedErrors,
                });
                return;
            }
            return next(error);
        }
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validate.middleware.js.map
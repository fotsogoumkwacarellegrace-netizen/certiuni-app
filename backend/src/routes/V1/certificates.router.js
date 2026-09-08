"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const express_1 = require("express");
const database_1 = require("../../config/database");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const generatePublicIdentifier = (universityCode) => {
    const year = new Date().getFullYear();
    const randomHex = crypto_1.default.randomBytes(3).toString('hex').toUpperCase();
    return `${universityCode.toUpperCase()}-${year}-${randomHex}`;
};
const buildCanonicalString = (params) => {
    const clean = (value) => value.trim().toUpperCase();
    return [
        clean(params.publicIdentifier),
        clean(params.studentLastName),
        clean(params.studentFirstName),
        clean(params.degreeTitle),
        clean(params.fieldOfStudy),
        clean(params.universityCode),
        clean(params.issueDate),
    ].join('|');
};
router.get('/:id/pdf', auth_middleware_1.authenticateJwt, async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const certificate = await database_1.prisma.certificate.findUnique({
        where: { id },
        include: { university: true },
    });
    if (!certificate) {
        res.status(404).json({ status: 'fail', message: 'Diplôme introuvable.' });
        return;
    }
    if (!certificate.pdfUrl) {
        res.status(404).json({ status: 'fail', message: 'Aucun PDF associé à ce diplôme.' });
        return;
    }
    res.redirect(certificate.pdfUrl);
});
router.post('/issue', auth_middleware_1.authenticateJwt, async (req, res) => {
    try {
        const { studentIdentifier, studentFirstName, studentLastName, studentEmail, degreeTitle, fieldOfStudy, grade, issueDate, universityId, } = req.body;
        if (!studentIdentifier || !studentFirstName || !studentLastName || !studentEmail || !degreeTitle || !fieldOfStudy || !grade || !issueDate || !universityId) {
            res.status(400).json({ status: 'fail', message: 'Tous les champs requis doivent être fournis.' });
            return;
        }
        const university = await database_1.prisma.university.findUnique({ where: { id: universityId } });
        if (!university) {
            res.status(404).json({ status: 'fail', message: 'Université introuvable.' });
            return;
        }
        const publicIdentifier = generatePublicIdentifier(university.code);
        const canonicalString = buildCanonicalString({
            publicIdentifier,
            studentLastName,
            studentFirstName,
            degreeTitle,
            fieldOfStudy,
            universityCode: university.code,
            issueDate,
        });
        const canonicalHash = crypto_1.default.createHash('sha256').update(canonicalString).digest('hex');
        const issuedById = req.user?.id;
        if (!issuedById) {
            res.status(401).json({ status: 'fail', message: 'Utilisateur non identifié.' });
            return;
        }
        const certificate = await database_1.prisma.certificate.create({
            data: {
                publicIdentifier,
                canonicalHash,
                studentIdentifier: studentIdentifier.trim(),
                studentFirstName: studentFirstName.trim(),
                studentLastName: studentLastName.trim(),
                studentEmail: studentEmail.trim(),
                degreeTitle: degreeTitle.trim(),
                fieldOfStudy: fieldOfStudy.trim(),
                grade: grade.trim(),
                issueDate: new Date(issueDate),
                status: 'ISSUED',
                universityId,
                issuedById,
            },
            include: {
                university: true,
            },
        });
        res.status(201).json({
            status: 'success',
            message: 'Diplôme émis avec succès.',
            data: {
                id: certificate.id,
                publicIdentifier: certificate.publicIdentifier,
                canonicalHash: certificate.canonicalHash,
                studentName: `${certificate.studentFirstName} ${certificate.studentLastName}`,
                degreeTitle: certificate.degreeTitle,
                fieldOfStudy: certificate.fieldOfStudy,
                grade: certificate.grade,
                issueDate: certificate.issueDate,
                university: {
                    id: certificate.university.id,
                    name: certificate.university.name,
                    code: certificate.university.code,
                },
            },
        });
    }
    catch (error) {
        console.error('Erreur lors de l\'émission du diplôme :', error);
        res.status(500).json({ status: 'error', message: 'Erreur interne lors de l\'émission du diplôme.' });
    }
});
exports.default = router;
//# sourceMappingURL=certificates.router.js.map
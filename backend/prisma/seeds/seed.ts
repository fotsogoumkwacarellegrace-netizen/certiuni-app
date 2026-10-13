import { PrismaClient, UserRole, PaymentMethod, PaymentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Début du remplissage de la base de données (Seeding)...');

        // 1. Hashage d'un mot de passe par défaut sécurisé avec Bcrypt (facteur de coût 12)
    const defaultPasswordHash = await bcrypt.hash('CertiUni2026!', 12);

    // 2. Création des Types de Documents
    const diplomaDocType = await prisma.documentType.upsert({
        where: { code: 'DIPLOMA' },
        update: {},
        create: {
            code: 'DIPLOMA',
            name: 'Diplôme Officiel',
            description: 'Diplôme d’État ou certificat de fin d’études',
        },
    });

    const transcriptDocType = await prisma.documentType.upsert({
        where: { code: 'TRANSCRIPT' },
        update: {},
        create: {
            code: 'TRANSCRIPT',
            name: 'Relevé de Notes',
            description: 'Relevé officiel des notes d’un semestre ou d’une année',
        },
    });
    console.log('✅ Types de documents initialisés');

    // 3. Création de l'Université de Démonstration (Tenant)
    const uy1 = await prisma.university.upsert({
        where: { code: 'UY1' },
        update: {
            website: 'https://uy1.uninet.cm',
        },
        create: {
            name: 'Université de Yaoundé I',
            code: 'UY1',
            website: 'https://uy1.uninet.cm',
            isVerified: true,
        },
    });
    console.log(`✅ Université configurée : ${uy1.name} (${uy1.code})`);

    // 4. Structure Académique UY1 (Program, Level, Year)
    const programInfo = await prisma.program.upsert({
        where: { code_universityId: { code: 'INFO-FS', universityId: uy1.id } },
        update: {},
        create: {
            code: 'INFO-FS',
            name: 'Informatique - Faculté des Sciences',
            description: 'Département d’Informatique',
            universityId: uy1.id,
        },
    });

    const levelL3 = await prisma.academicLevel.upsert({
        where: { code_universityId: { code: 'L3', universityId: uy1.id } },
        update: {},
        create: {
            code: 'L3',
            name: 'Licence 3',
            universityId: uy1.id,
        },
    });

    const year2026 = await prisma.academicYear.upsert({
        where: { year_universityId: { year: '2025-2026', universityId: uy1.id } },
        update: {},
        create: {
            year: '2025-2026',
            universityId: uy1.id,
        },
    });
    console.log('✅ Structure académique UY1 créée (Filière, Niveau, Année)');

    // 5. Création des Rôles RBAC de base
    const superAdminRole = await prisma.role.upsert({
        where: { name: 'SUPER_ADMIN' },
        update: {},
        create: { name: 'SUPER_ADMIN', description: 'Accès total à la plateforme' },
    });

    const issuerRole = await prisma.role.upsert({
        where: { name: 'ISSUER' },
        update: {},
        create: { name: 'ISSUER', description: 'Agent d’émission des diplômes' },
    });

    // 6. Création des Utilisateurs
    // A) SUPER_ADMIN
    const superAdmin = await prisma.user.upsert({
        where: { email: 'superadmin@certiuni.cm' },
        update: {
            passwordHash: defaultPasswordHash,
        },
        create: {
            email: 'superadmin@certiuni.cm',
            passwordHash: defaultPasswordHash,
            firstName: 'Super',
            lastName: 'Admin',
            role: UserRole.SUPER_ADMIN,
            isActive: true,
        },
    });

    await prisma.userRoleLink.upsert({
        where: { userId_roleId: { userId: superAdmin.id, roleId: superAdminRole.id } },
        update: {},
        create: { userId: superAdmin.id, roleId: superAdminRole.id },
    });
    console.log(`✅ Compte SuperAdmin configuré : ${superAdmin.email}`);

    // B) ADMIN UNIVERSITÉ / AGENT D'ÉMISSION
    const adminUniv = await prisma.user.upsert({
        where: { email: 'admin@uy1.uninet.cm' },
        update: {
            role: UserRole.ISSUER,
            passwordHash: defaultPasswordHash,
            universityId: uy1.id,
        },
        create: {
            email: 'admin@uy1.uninet.cm',
            passwordHash: defaultPasswordHash,
            firstName: 'Admin',
            lastName: 'UY1',
            role: UserRole.ISSUER,
            universityId: uy1.id,
            isActive: true,
        },
    });

    await prisma.userRoleLink.upsert({
        where: { userId_roleId: { userId: adminUniv.id, roleId: issuerRole.id } },
        update: {},
        create: { userId: adminUniv.id, roleId: issuerRole.id },
    });

    await prisma.userUniversity.upsert({
        where: { userId_universityId: { userId: adminUniv.id, universityId: uy1.id } },
        update: {},
        create: { userId: adminUniv.id, universityId: uy1.id },
    });
    console.log(`✅ Compte Admin Université configuré : ${adminUniv.email}`);

    // 7. Création d'un Étudiant de démonstration
    const studentUser = await prisma.user.upsert({
        where: { email: 'student.demo@uy1.uninet.cm' },
        update: { passwordHash: defaultPasswordHash },
        create: {
            email: 'student.demo@uy1.uninet.cm',
            passwordHash: defaultPasswordHash,
            firstName: 'Jean',
            lastName: 'Dupont',
            role: UserRole.STUDENT,
            universityId: uy1.id,
        },
    });

    const student = await prisma.student.upsert({
        where: { matricule_universityId: { matricule: '21U2890', universityId: uy1.id } },
        update: {
            userId: studentUser.id,
        },
        create: {
            matricule: '21U2890',
            firstName: 'Jean',
            lastName: 'Dupont',
            email: studentUser.email,
            phone: '+237690000000',
            userId: studentUser.id,
            universityId: uy1.id,
            programId: programInfo.id,
            levelId: levelL3.id,
            yearId: year2026.id,
        },
    });
    console.log(`✅ Étudiant de démo créé : ${student.firstName} ${student.lastName} (${student.matricule})`);

    // 8. Services et Tarification
    const reissueService = await prisma.service.upsert({
        where: { code_universityId: { code: 'DIPLOMA_ISSUE', universityId: uy1.id } },
        update: {},
        create: {
            code: 'DIPLOMA_ISSUE',
            name: 'Délivrance de Diplôme Numérique',
            description: 'Émission initiale et certification du diplôme de Licence',
            universityId: uy1.id,
            documentTypeId: diplomaDocType.id,
        },
    });

    await prisma.pricing.create({
        data: {
            amount: 5000.0,
            currency: 'XAF',
            isFree: false,
            serviceId: reissueService.id,
            universityId: uy1.id,
        },
    });
    console.log(`✅ Services & Tarifs configurés pour ${uy1.code}`);

    // 9. Création d'un Modèle de Diplôme de démonstration
    let template = await prisma.certificateTemplate.findFirst({
        where: { name: 'Diplôme de Licence en Informatique - 2026', universityId: uy1.id },
    });

    if (!template) {
        template = await prisma.certificateTemplate.create({
            data: {
                name: 'Diplôme de Licence en Informatique - 2026',
                description: 'Modèle officiel de diplôme de Licence pour la Faculté des Sciences',
                layoutConfig: {
                    pageSize: 'A4',
                    orientation: 'landscape',
                    backgroundUrl: 'https://storage.certiuni.cm/templates/uy1-bg.png',
                    fields: [
                        { key: 'studentName', label: "Nom de l'étudiant", x: 200, y: 150, fontSize: 18, fontStyle: 'bold' },
                        { key: 'degreeName', label: 'Intitulé du Diplôme', x: 200, y: 200, fontSize: 16 },
                        { key: 'issueDate', label: 'Date de Délivrance', x: 200, y: 280, fontSize: 12 },
                        { key: 'qrCode', label: 'QR Code de Vérification', x: 700, y: 400, width: 100, height: 100 },
                    ],
                },
                universityId: uy1.id,
            },
        });
    }
    console.log(`✅ Modèle de diplôme prêt : ${template.name}`);

    console.log('🚀 Seeding terminé avec succès !');
}

main()
    .catch((e) => {
        console.error('❌ Erreur lors du seeding :', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
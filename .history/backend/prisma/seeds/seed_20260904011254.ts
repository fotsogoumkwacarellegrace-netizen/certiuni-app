import { PrismaClient, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Début du remplissage de la base de données (Seeding)...');

    // 1. Hashage d'un mot de passe par défaut sécurisé avec Argon2
    const defaultPasswordHash = await argon2.hash('CertiUni2026!');

    // 2. Création de l'Université de Démonstration (Tenant)
    const uy1 = await prisma.university.upsert({
        where: { code: 'UY1' },
        update: {},
        create: {
            name: 'Université de Yaoundé I',
            code: 'UY1',
            website: 'https://uy1.uninet.cm',
        },
    });
    console.log(`✅ Université créée : ${uy1.name} (${uy1.code})`);

    // 3. Création du compte SUPER_ADMIN
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
        },
    });
    console.log(`✅ Compte SuperAdmin créé : ${superAdmin.email}`);

    // 4. Création d'un Gestionnaire d'Université
    const adminUniv = await prisma.user.upsert({
        where: { email: 'admin@uy1.uninet.cm' },
        update: {
            role: UserRole.ISSUER,
            passwordHash: defaultPasswordHash,
        },
        create: {
            email: 'admin@uy1.uninet.cm',
            passwordHash: defaultPasswordHash,
            firstName: 'Admin',
            lastName: 'UY1',
            role: UserRole.ISSUER,
            universityId: uy1.id,
        },
    });
    console.log(`✅ Compte Admin Université créé : ${adminUniv.email}`);

    // 5. Création d'un Modèle de Diplôme de démonstration
    const template = await prisma.certificateTemplate.create({
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
    console.log(`✅ Modèle de diplôme créé : ${template.name}`);

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
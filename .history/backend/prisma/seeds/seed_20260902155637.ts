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
            passwordHash: defaultPasswordHash, // Force la mise à jour avec le hash Argon2
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
            passwordHash: defaultPasswordHash, // Force la mise à jour avec le hash Argon2
        },
        create: {
            email: 'admin@uy1.uninet.cm',
            passwordHash: defaultPasswordHash,
            firstName: 'Admin',
            lastName: 'UY1',
            role: UserRole.UNIVERSITY_ADMIN,
            universityId: uy1.id,
        },
    });
    console.log(`✅ Compte Admin Université créé : ${adminUniv.email}`);

    // 5. Création d'un Étudiant de démo
    if ('student' in prisma && typeof (prisma as any).student?.upsert === 'function') {
        const student = await (prisma as any).student.upsert({
            where: {
                universityId_studentIdNumber: {
                    universityId: uy1.id,
                    studentIdNumber: '22U2026',
                },
            },
            update: {},
            create: {
                universityId: uy1.id,
                studentIdNumber: '22U2026',
                firstName: 'Jean',
                lastName: 'Dupont',
                email: 'jean.dupont@student.uy1.cm',
            },
        });
        console.log(`✅ Étudiant de test créé : ${student.firstName} ${student.lastName}`);
    }

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
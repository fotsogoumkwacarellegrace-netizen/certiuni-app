import { PrismaClient, RoleEnum, CertificateStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Début du remplissage de la base de données (Seeding)...');

    // 1. Hashage d'un mot de passe par défaut sécurisé
    const defaultPasswordHash = await bcrypt.hash('CertiUni2026!', 12);

    // 2. Création de l'Université de Démonstration (Tenant)
    const uy1 = await prisma.university.upsert({
        where: { code: 'UY1' },
        update: {},
        create: {
            name: 'Université de Yaoundé I',
            code: 'UY1',
            domain: 'uy1.uninet.cm',
        },
    });
    console.log(`✅ Université créée : ${uy1.name} (${uy1.code})`);

    // 3. Création du compte SUPER_ADMIN (Plateforme globale)
    const superAdmin = await prisma.user.upsert({
        where: { email: 'superadmin@certiuni.cm' },
        update: {},
        create: {
            email: 'superadmin@certiuni.cm',
            passwordHash: defaultPasswordHash,
            role: RoleEnum.SUPER_ADMIN,
        },
    });
    console.log(`✅ Compte SuperAdmin créé : ${superAdmin.email}`);

    // 4. Création d'un Gestionnaire d'Université (ADMIN_UNIV)
    const adminUniv = await prisma.user.upsert({
        where: { email: 'admin@uy1.uninet.cm' },
        update: {},
        create: {
            email: 'admin@uy1.uninet.cm',
            passwordHash: defaultPasswordHash,
            role: RoleEnum.ADMIN_UNIV,
            universityId: uy1.id,
        },
    });
    console.log(`✅ Compte Admin Université créé : ${adminUniv.email}`);

    // 5. Création d'un Etudiant de démo
    const student = await prisma.student.upsert({
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
    console.log(`✅ Étudiant de test créé : ${student.firstName} ${student.lastName} (${student.studentIdNumber})`);

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
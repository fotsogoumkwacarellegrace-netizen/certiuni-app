import * as bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import { signToken } from '../lib/jwt';
import { Errors } from '../lib/httpError';
import { LoginDto } from './dto/login.dto';

/**
 * AuthService — version Express.
 *
 * Remplace `@Injectable()` NestJS, `JwtService` (@nestjs/jwt) et `PrismaService`.
 * Utilise `jsonwebtoken` (via lib/jwt.ts), `bcrypt` et le singleton Prisma.
 */
export class AuthService {
  constructor() {}

  /**
   * Valide les identifiants et genere un jeton d'acces JWT.
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. Recherche de l'utilisateur par son email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        university: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    if (!user) {
      throw Errors.unauthorized("Identifiants invalides (email introuvable)");
    }

    // 2. Verification du mot de passe hashé
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw Errors.unauthorized("Identifiants invalides (mot de passe incorrect)");
    }

    // 3. Construction du Payload du JWT (informations de Tenant incluses)
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      universityId: user.universityId,
    };

    // 4. Generation du Jeton JWT
    const accessToken = signToken(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        universityId: user.universityId,
        universityName: user.university?.name ?? null,
      },
    };
  }
}

export default AuthService;
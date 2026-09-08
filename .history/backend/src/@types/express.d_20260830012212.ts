import { UserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole | string;
        universityId?: string | null;
      };
    }
  }
}
// import { RoleEnum } from '@prisma/client';

// export interface JwtPayload {
//   userId: string;
//   universityId: string | null;
//   email: string;
//   role: RoleEnum;
// }

// declare global {
//   namespace Express {
//     interface Request {
//       user?: JwtPayload;
//     }
//   }
// }
import { UserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: UserRole | string;
      universityId?: string | null;
    }

    interface Request {
      user?: User;
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
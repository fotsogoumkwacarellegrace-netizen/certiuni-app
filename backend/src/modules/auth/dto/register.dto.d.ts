import { Role } from '../../../common/decorators/roles.decorator';
export declare class RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
    universityId?: string;
}

import { Role } from '../../../common/decorators/roles.decorator';
export declare class CreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
    universityId?: string;
}

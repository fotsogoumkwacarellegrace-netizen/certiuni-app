export declare const ROLES_KEY = "roles";
export declare enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ISSUER = "ISSUER",
    VERIFIER = "VERIFIER"
}
export declare const Roles: (...roles: (Role | string)[]) => import("@nestjs/common").CustomDecorator<string>;

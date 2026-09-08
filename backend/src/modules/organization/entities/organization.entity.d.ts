export declare enum OrganizationType {
    FACULTY = "FACULTY",
    SCHOOL = "SCHOOL",
    UFR = "UFR",
    DEPARTMENT = "DEPARTMENT",
    CENTER = "CENTER",
    CAMPUS = "CAMPUS",
    RECRUITER = "RECRUITER",
    OTHER = "OTHER"
}
export declare class OrganizationEntity {
    id: string;
    institutionId: string;
    name: string;
    code: string;
    type: OrganizationType;
    description?: string;
    parentId?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

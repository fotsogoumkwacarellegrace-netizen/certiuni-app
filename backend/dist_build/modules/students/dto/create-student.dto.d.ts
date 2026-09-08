export declare enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE"
}
export declare class CreateStudentDto {
    userId: string;
    matricule: string;
    birthDate: string;
    birthPlace: string;
    nationality: string;
    gender: Gender;
    idCardNumber?: string;
}

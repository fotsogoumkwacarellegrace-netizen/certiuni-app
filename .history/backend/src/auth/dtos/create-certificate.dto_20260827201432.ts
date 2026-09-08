import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCertificateDto {
    @IsString()
    @IsNotEmpty({ message: 'Le prénom du récipiendaire est requis' })
    studentFirstName: string;

    @IsString()
    @IsNotEmpty({ message: 'Le nom du récipiendaire est requis' })
    studentLastName: string;

    @IsString()
    @IsNotEmpty({ message: 'Le libellé du diplôme/titre est requis' })
    degreeTitle: string;

    @IsString()
    @IsNotEmpty({ message: 'Le domaine/spécialité est requis' })
    fieldOfStudy: string;

    @IsString()
    @IsNotEmpty({ message: 'La mention attribuée est requise' })
    grade: string; // Ex: "Très Bien", "Honors"

    @IsString()
    @IsNotEmpty({ message: "La date d'émission est requise" })
    issueDate: string; // Format ISO: YYYY-MM-DD

    @IsUUID()
    @IsNotEmpty({ message: "L'ID de l'établissement émetteur est requis" })
    universityId: string;

    @IsString()
    @IsOptional()
    metadataJson?: string;
}
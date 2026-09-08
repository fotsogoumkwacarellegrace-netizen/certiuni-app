export declare enum ServiceCategory {
    DOCUMENT_ISSUANCE = "DOCUMENT_ISSUANCE",
    VERIFICATION = "VERIFICATION",
    TRANSLATION = "TRANSLATION",
    DELIVERY = "DELIVERY",
    OTHER = "OTHER"
}
export declare class CreateServiceDto {
    name: string;
    code: string;
    description?: string;
    price: number;
    currency?: string;
    category: ServiceCategory;
    isActive?: boolean;
}

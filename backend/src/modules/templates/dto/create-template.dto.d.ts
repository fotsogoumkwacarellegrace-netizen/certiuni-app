export declare class CreateTemplateDto {
    name: string;
    isActive: boolean;
    description?: string;
    htmlContent: string;
    cssContent?: string;
    isDefault?: boolean;
    layoutConfig: Record<string, any>;
    universityId?: string;
}

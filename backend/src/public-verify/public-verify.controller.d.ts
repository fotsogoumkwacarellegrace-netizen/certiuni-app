import { PublicVerifyService } from './public-verify.service';
export declare class PublicVerifyController {
    private readonly verifyService;
    constructor(verifyService: PublicVerifyService);
    verifyByIdentifier(identifier: string): Promise<import("./dto/verify-reponse.dto").VerifyCertificateResponseDto>;
    verifyByHash(hash: string): Promise<import("./dto/verify-reponse.dto").VerifyCertificateResponseDto>;
}

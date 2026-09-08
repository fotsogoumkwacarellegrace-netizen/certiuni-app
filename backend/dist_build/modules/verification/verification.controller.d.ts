import { VerificationService, VerificationResult } from './verification.service';
import { VerifyHashDto } from './dto/verify-hash.dto';
import { VerifyQrDto } from './dto/verify-qr.dto';
export declare class VerificationController {
    private readonly verificationService;
    constructor(verificationService: VerificationService);
    verifyHash(dto: VerifyHashDto): Promise<VerificationResult>;
    verifyQr(dto: VerifyQrDto): Promise<VerificationResult>;
}

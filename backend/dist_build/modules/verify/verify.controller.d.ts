import { VerifyService, VerificationResult } from './verify.service';
import { VerifyHashParamDto, VerifyQrDto } from './dto/verify-hash.dto';
export declare class VerifyController {
    private readonly verifyService;
    constructor(verifyService: VerifyService);
    verifyByHash(params: VerifyHashParamDto): Promise<VerificationResult>;
    verifyByQr(dto: VerifyQrDto): Promise<VerificationResult>;
}

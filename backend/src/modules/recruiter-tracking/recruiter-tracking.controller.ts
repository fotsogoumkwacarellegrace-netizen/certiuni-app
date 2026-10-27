import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RecruiterTrackingService } from './recruiter-tracking.service';

@Controller('recruiter-tracking')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('RECRUITER')
export class RecruiterTrackingController {
  constructor(private readonly service: RecruiterTrackingService) {}

  @Get('queue')
  getTreatmentQueue(@GetUser('id') recruiterId: string, @Query('status') status?: string) {
    return this.service.getTreatmentQueue(recruiterId, status);
  }

  @Get('needing-attention')
  getRequestsNeedingAttention(@GetUser('id') recruiterId: string) {
    return this.service.getRequestsNeedingAttention(recruiterId);
  }

  @Get(':requestId')
  getRequestForTreatment(@Param('requestId') requestId: string, @GetUser('id') recruiterId: string) {
    return this.service.getRequestForTreatment(requestId, recruiterId);
  }

  @Post(':requestId/comments')
  addVerificationComment(
    @Param('requestId') requestId: string,
    @Body() data: { comment: string },
    @GetUser('id') recruiterId: string,
  ) {
    if (!data.comment?.trim()) {
      throw new BadRequestException('Le commentaire est requis');
    }

    return this.service.addVerificationComment(requestId, data.comment, recruiterId);
  }

  @Patch(':requestId/documents')
  requestAdditionalDocuments(
    @Param('requestId') requestId: string,
    @Body() data: { requiredDocuments: string[] },
    @GetUser('id') recruiterId: string,
  ) {
    return this.service.requestAdditionalDocuments(requestId, data.requiredDocuments, recruiterId);
  }
}

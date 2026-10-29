import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UniversityStatusService } from './university-status.service';

@Controller('university-status')
export class UniversityStatusController {
  constructor(private readonly service: UniversityStatusService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.UNIV_ADMIN, UserRole.SUPER_ADMIN)
  @Get(':requestId/history')
  async getRequestStatusHistory(@Param('requestId') requestId: string) {
    return this.service.getRequestStatusHistory(requestId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.UNIV_ADMIN, UserRole.SUPER_ADMIN)
  @Patch(':requestId/status')
  async updateRequestStatus(
    @Param('requestId') requestId: string,
    @Body() data: {
      newStatus: string;
      comment?: string;
    },
    @GetUser('id') changedBy: string,
  ) {
    return this.service.updateRequestStatus(requestId, data.newStatus, changedBy, data.comment);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.UNIV_ADMIN, UserRole.SUPER_ADMIN)
  @Get(':universityId/pending')
  async getPendingRequests(@Param('universityId') universityId: string) {
    return this.service.getPendingRequestsByUniversity(universityId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.UNIV_ADMIN, UserRole.SUPER_ADMIN)
  @Get(':universityId/stats')
  async getRequestStatusStats(@Param('universityId') universityId: string) {
    return this.service.getRequestStatusStats(universityId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Get(':studentId/history')
  async getStudentRequestHistory(@Param('studentId') studentId: string) {
    return this.service.getStudentRequestHistory(studentId);
  }
}
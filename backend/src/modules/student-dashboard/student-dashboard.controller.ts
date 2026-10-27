import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { StudentDashboardService } from './student-dashboard.service';

@Controller('student-dashboard')
export class StudentDashboardController {
  constructor(private readonly service: StudentDashboardService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Get('stats')
  async getDashboardStats(@GetUser('id') userId: string) {
    return this.service.getDashboardStats(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Get('documents')
  async getIssuedDocuments(
    @GetUser('id') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.service.getIssuedDocuments(userId, page, limit);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Get('pending-requests')
  async getPendingRequests(@GetUser('id') userId: string) {
    return this.service.getPendingRequests(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Get('notifications')
  async getNotificationHistory(
    @GetUser('id') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.service.getNotificationHistory(userId, page, limit);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Post('notifications/:notificationId/read')
  async markNotificationAsRead(
    @Param('notificationId') notificationId: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.markNotificationAsRead(notificationId, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Get('profile')
  async getStudentProfile(@GetUser('id') userId: string) {
    return this.service.getStudentProfile(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Post('profile')
  async updateStudentProfile(
    @GetUser('id') userId: string,
    @Body() data: { firstName?: string; lastName?: string },
  ) {
    return this.service.updateStudentProfile(userId, data);
  }
}
import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RecruiterService } from './recruiter.service';

@Controller('recruiter')
export class RecruiterController {
  constructor(private readonly recruiterService: RecruiterService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('RECRUITER')
  @Get('services')
  async getAvailableServices(@GetUser('id') recruiterId: string) {
    return this.recruiterService.getAvailableServices(recruiterId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('RECRUITER')
  @Post('price/confirmation')
  async getPriceBeforeConfirmation(
    @Body() body: { serviceId: string },
    @GetUser('id') recruiterId: string,
  ) {
    return this.recruiterService.getPriceBeforeConfirmation(body.serviceId, recruiterId);
  }
}
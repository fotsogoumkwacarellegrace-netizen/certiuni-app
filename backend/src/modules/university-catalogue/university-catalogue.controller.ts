import { Controller, Get, Post, Body, Param, UseGuards, Query, Patch, Delete } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UniversityCatalogueService } from './university-catalogue.service';

@Controller('university-catalogue')
export class UniversityCatalogueController {
  constructor(private readonly service: UniversityCatalogueService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.UNIV_ADMIN, UserRole.SUPER_ADMIN)
  @Get()
  async getAllServices(@Query('universityId') universityId?: string) {
    return this.service.getAllServices(universityId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.UNIV_ADMIN, UserRole.SUPER_ADMIN)
  @Get(':serviceId')
  async getServiceById(@Param('serviceId') serviceId: string) {
    return this.service.getServiceById(serviceId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  async createService(@Body() data: {
    universityId: string;
    documentTypeId: string;
    name: string;
    code: string;
    description?: string;
    price?: number;
    currency?: string;
  }) {
    return this.service.createService(data.universityId, {
      documentTypeId: data.documentTypeId,
      name: data.name,
      code: data.code,
      description: data.description,
      price: data.price,
      currency: data.currency,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
  @Patch(':serviceId')
  async updateService(
    @Param('serviceId') serviceId: string,
    @Body() data: {
      name?: string;
      code?: string;
      description?: string;
      price?: number;
      currency?: string;
    },
  ) {
    return this.service.updateService(serviceId, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Delete(':serviceId')
  async deleteService(@Param('serviceId') serviceId: string) {
    return this.service.deleteService(serviceId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.UNIV_ADMIN, UserRole.SUPER_ADMIN)
  @Get('category/:category')
  async getServicesByCategory(@Param('category') category: string) {
    return this.service.getServicesByCategory(category);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.UNIV_ADMIN, UserRole.SUPER_ADMIN)
  @Get(':universityId/stats')
  async getUniversityServiceStats(@Param('universityId') universityId: string) {
    return this.service.getUniversityServiceStats(universityId);
  }
}
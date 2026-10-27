import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class SuperAdminDashboardService {
  private readonly logger = new Logger(SuperAdminDashboardService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get global supervision dashboard
   * ADM-05: Interface supervision/dashboard (partiel)
   */
  async getGlobalSupervision() {
    const [totalUsers, totalUniversities, totalRequests, pendingRequests,
         activeVerifications, totalGraduates] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.university.count(),
      this.prisma.request.count(),
      this.prisma.request.count({ where: { status: 'PENDING' } }),
      this.prisma.verificationLog.count(),
      this.prisma.student.count(),
    ]);

    return {
      totalUsers,
      totalUniversities,
      totalRequests,
      pendingRequests,
      activeVerifications,
      totalGraduates,
    };
  }

  /**
   * Get university statistics for supervision
   */
  async getUniversitySupervision(universityId: string) {
    const [totalPrograms, totalStudents, totalRequests, approvedRequests] = await Promise.all([
      this.prisma.program.count({ where: { universityId } }),
      this.prisma.student.count({ where: { universityId } }),
      this.prisma.request.count({ where: { student: { universityId } } }),
      this.prisma.request.count({ where: { student: { universityId }, status: 'APPROVED' } }),
    ]);

    return {
      totalPrograms,
      totalStudents,
      totalRequests,
      approvedRequests,
    };
  }

  /**
   * Get all pending requests system-wide
   */
  async getAllPendingRequests() {
    return this.prisma.request.findMany({
      where: { status: 'PENDING' },
      include: {
        student: {
          select: { id: true, email: true, firstName: true, lastName: true, university: true },
        },
        service: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  /**
   * Get system-wide statistics by status
   */
  async getStatusDistribution() {
    const [pending, processing, approved, rejected] = await Promise.all([
      this.prisma.request.count({ where: { status: 'PENDING' } }),
      this.prisma.request.count({ where: { status: 'IN_PROGRESS' } }),
      this.prisma.request.count({ where: { status: 'APPROVED' } }),
      this.prisma.request.count({ where: { status: 'REJECTED' } }),
    ]);

    return { pending, processing, approved, rejected };
  }

  /**
   * Get recent activity/logs
   */
  async getRecentActivity(days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const events = await this.prisma.auditLog.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    const counts = new Map<string, number>();
    for (const { createdAt } of events) {
      const date = createdAt.toISOString().slice(0, 10);
      counts.set(date, (counts.get(date) ?? 0) + 1);
    }

    return Array.from(counts, ([date, count]) => ({ date, count }));
  }

  /**
   * Get user role distribution
   */
  async getRoleDistribution() {
    return this.prisma.user.groupBy({
      by: [ 'role' ],
      _count: {
        role: true,
      },
    });
  }

  /**
   * Get exportable data (ADM-08)
   */
  async getExportableData(exportType: 'requests' | 'users' | 'universities') {
    switch (exportType) {
      case 'requests':
        return this.prisma.request.findMany({
          include: {
            student: {
              select: { id: true, email: true, firstName: true, lastName: true, university: true },
            },
            service: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
      case 'users':
        return this.prisma.user.findMany({
          select: { id: true, email: true, firstName: true, lastName: true, role: true, university: true },
          orderBy: { createdAt: 'desc' },
        });
      case 'universities':
        return this.prisma.university.findMany({
          select: { id: true, name: true, code: true, createdAt: true },
          orderBy: { name: 'asc' },
        });
      default:
        return null;
    }
  }
}
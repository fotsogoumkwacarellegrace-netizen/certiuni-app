import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(userId: string) {
    const student = await this.requireStudent(userId);
    const [issuedCertificates, pendingRequests, notifications, verificationCount] = await Promise.all([
      this.prisma.certificate.count({ where: { studentId: student.id, status: 'ISSUED' } }),
      this.prisma.request.count({ where: { studentId: student.id, status: 'PENDING' } }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
      this.prisma.verificationLog.count({ where: { certificate: { studentId: student.id } } }),
    ]);

    return { student, issuedCertificates, pendingRequests, notifications, verificationCount };
  }

  async getIssuedDocuments(userId: string, page = 1, limit = 10) {
    const student = await this.requireStudent(userId);
    const skip = (page - 1) * limit;
    const [documents, total] = await Promise.all([
      this.prisma.certificate.findMany({
        where: { studentId: student.id, status: 'ISSUED' },
        select: { id: true, degreeTitle: true, issueDate: true, pdfUrl: true, status: true },
        skip,
        take: limit,
        orderBy: { issueDate: 'desc' },
      }),
      this.prisma.certificate.count({ where: { studentId: student.id, status: 'ISSUED' } }),
    ]);

    return { documents, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getPendingRequests(userId: string) {
    const student = await this.requireStudent(userId);
    return this.prisma.request.findMany({
      where: { studentId: student.id, status: 'PENDING' },
      include: { service: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getNotificationHistory(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        select: { id: true, type: true, title: true, message: true, isRead: true, createdAt: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where: { userId } }),
    ]);

    return { notifications, total, page, totalPages: Math.ceil(total / limit) };
  }

  async markNotificationAsRead(notificationId: string, userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });

    if (result.count === 0) {
      throw new NotFoundException('Notification introuvable');
    }

    return { id: notificationId, isRead: true };
  }

  async getStudentProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        university: { select: { id: true, name: true } },
      },
    });
  }

  async updateStudentProfile(userId: string, data: { firstName?: string; lastName?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });
  }

  private async requireStudent(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      select: { id: true, email: true, firstName: true, lastName: true, matricule: true },
    });

    if (!student) {
      throw new NotFoundException('Profil étudiant introuvable');
    }

    return student;
  }
}
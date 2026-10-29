import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from '../prisma/prisma.module';
import { DiplomaVerificationController } from '@modules/diplomas-verification/diplomas-verification.controller';
import { DiplomaImageVerificationService } from '@modules/diplomas-verification/diplomas-verification.service';

@Module({
  imports: [
    // Retire cette ligne si PrismaModule est déclaré @Global()
    PrismaModule,
    // Retire cette ligne si ThrottlerModule.forRoot(...) existe déjà dans AppModule
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 10 }]),
  ],
  controllers: [DiplomaVerificationController],
  providers: [DiplomaImageVerificationService],
  exports: [DiplomaImageVerificationService],
})
export class DiplomaVerificationModule {}

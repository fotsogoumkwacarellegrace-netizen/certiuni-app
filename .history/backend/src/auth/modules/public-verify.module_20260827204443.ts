import { Module } from '@nestjs/common';
import { PublicVerifyController } from './public-verify.controller';
import { PublicVerifyService } from './public-verify.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PublicVerifyController],
  providers: [PublicVerifyService],
})
export class PublicVerifyModule {}
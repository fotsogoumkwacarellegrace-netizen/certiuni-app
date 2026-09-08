import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    // Configuration globale des variables d'environnement (.env)
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    // Modules d'infrastructure essentiels
    PrismaModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}



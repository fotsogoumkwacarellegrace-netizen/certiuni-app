import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UniversitiesModule } from './universities/universities.module'; // 👈 Import obligatoire
import { UsersModule } from './users/users.module'; // 👈 Ajouter l'importation


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    PrismaModule,
    RedisModule,
    UsersModule,
    AuthModule,
    UniversitiesModule, // 👈 À déclarer ici
    UsersModule, // 👈 Ajouter le module ici
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }


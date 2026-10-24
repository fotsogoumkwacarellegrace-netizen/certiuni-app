import { Module } from '@nestjs/common';
import { UniversityUsersService } from './university-users.service';
import { UniversityUsersController } from './university-users.controller';

@Module({
    controllers: [UniversityUsersController],
    providers: [UniversityUsersService],
    exports: [UniversityUsersService],
})
export class UniversityUsersModule { }
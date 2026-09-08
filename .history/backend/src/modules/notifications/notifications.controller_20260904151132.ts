import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    UseGuards,
    ParseUUIDPipe,
    Req,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { NotificationsService } from './notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ReceiveNotificationDto } from './dto/receive-notification.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(
        private readonly notificationsService: NotificationsService,
    ) { }

    @Post('send')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Envoyer une notification / email à un utilisateur (Admin)' })
    @ApiResponse({ status: 201, description: 'Notification envoyée avec succès.' })
    send(@Body() dto: SendNotificationDto) {
        return this.notificationsService.send(dto);
    }

    // À mettre à jour dans NotificationsController :
    @Get('my-notifications')
    @ApiOperation({ summary: 'Consulter mes notifications avec filtres et pagination' })
    findMyNotifications(
        @Req() req: any,
        @Query() query: ReceiveNotificationDto,
    ) {
        return this.notificationsService.findAllForUser(req.user.id, query);
    }
    
    @Patch(':id/read')
    @ApiOperation({ summary: 'Marquer une notification comme lue' })
    markAsRead(
        @Param('id', ParseUUIDPipe) id: string,
        @Req() req: any,
    ) {
        return this.notificationsService.markAsRead(id, req.user.id);
    }

    @Patch('read-all')
    @ApiOperation({ summary: 'Marquer toutes mes notifications comme lues' })
    markAllAsRead(@Req() req: any) {
        return this.notificationsService.markAllAsRead(req.user.id);
    }
}
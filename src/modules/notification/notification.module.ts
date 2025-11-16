import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [NotificationService],
  exports: [NotificationService],
  imports: [HttpModule],
})
export class NotificationModule {}

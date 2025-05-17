import { Module } from '@nestjs/common';
import { ResendService } from './resend.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ResendService],
})
export class MailsModule {}

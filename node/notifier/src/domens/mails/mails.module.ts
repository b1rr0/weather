import { Module } from '@nestjs/common';
import { MailtraDemoApiService } from './resend.service';

@Module({
  imports: [],
  controllers: [],
  providers: [MailtraDemoApiService],
})
export class MailsModule {}

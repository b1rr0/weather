import { Module } from '@nestjs/common';
import { MailtraDemoApiService } from './mailtra.demo.service';

@Module({
  imports: [],
  controllers: [],
  providers: [MailtraDemoApiService],
})
export class MailsModule {}

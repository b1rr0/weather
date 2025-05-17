import { Module } from '@nestjs/common';
import { CacheRepository } from './cache.repo';
import { AsyncHandlingService } from './async_hendling.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CacheRepository, AsyncHandlingService],
})
export class AsyncHandlingModule {}

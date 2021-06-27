import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { swapHistoryProviders } from '../providers/swapHistory';
import { SwapHistoryService } from '../services/swapHistory';
import { SwapHistoryResolver } from '../resolvers/swapHistory';

@Module({
  imports: [DatabaseModule],
  providers: [SwapHistoryService, SwapHistoryResolver, ...swapHistoryProviders],
})
export class SwapHistoryModule {}

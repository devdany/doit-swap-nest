import { Module } from '@nestjs/common';
import { bscProviders } from './bsc.provider';

@Module({
  providers: [...bscProviders],
  exports: [...bscProviders],
})
export class BscModule {}

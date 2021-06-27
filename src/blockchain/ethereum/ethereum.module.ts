import { Module } from '@nestjs/common';
import { ethereumProviders } from './ethereum.provider';

@Module({
  providers: [...ethereumProviders],
  exports: [...ethereumProviders],
})
export class EthereumModule {}

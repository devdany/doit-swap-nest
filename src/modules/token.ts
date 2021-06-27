import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { tokenProviders } from '../providers/token';
import { TokenService } from '../services/token';
import { TokenResolver } from '../resolvers/token';

@Module({
  imports: [DatabaseModule],
  providers: [TokenService, TokenResolver, ...tokenProviders],
})
export class TokenModule {}

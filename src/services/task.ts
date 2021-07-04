import { Injectable, Inject, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TokenEntity } from '../entities/token'
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import { Repository as RepositoryKeyStore } from '../injectKeyStore'

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  // constructor(
  //   @Inject(RepositoryKeyStore.TOKEN_REPOSITORY)
  //   private tokenRepository: Repository<TokenEntity>,
  // ) {}

  @Interval(1000)
  checkNewBurnToken() {
    console.log('????')
    this.logger.debug('Called when the current second');
    // const tokens = await this.tokenRepository.find({
    //   relations: ['swapables']
    // })
    // for (const token of tokens) {
    //   if (token.swapables.length === 0) {
    //     continue
    //   }
    //   console.log(token)
    // }
  }
}
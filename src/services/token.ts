import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TokenEntity, Network } from '../entities/token';
import { Repository as RepositoryKeyStore } from '../injectKeyStore';

type TokenWhere = {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
  name?: string;
  address?: string;
  network?: Network;
  isAbleToBeSwapped?: any
}

@Injectable()
export class TokenService {
  constructor(
    @Inject(RepositoryKeyStore.TOKEN_REPOSITORY)
    private tokenRepository: Repository<TokenEntity>,
  ) {}

  async findAll(relations?: string[], where?: TokenWhere): Promise<TokenEntity[]> {
    return this.tokenRepository.find({
      where: {
        deletedAt: null,
        ...where
      },
      relations,
    })
  }

  async findToken(id: number, relations?: string[]): Promise<TokenEntity> {
    return this.tokenRepository.findOne({
      where: {
        id,
      },
      relations,
    });
  }
}

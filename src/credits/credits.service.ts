// src/credits/credits.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credit } from './entities/credit.entity';

@Injectable()
export class CreditsService {
  constructor(
    @InjectRepository(Credit)
    private readonly creditsRepository: Repository<Credit>,
  ) {}

  async getCredits(): Promise<Credit> {
    const [credit] = await this.creditsRepository.find();
    if (credit === undefined) {
      throw new NotFoundException('Credits not found');
    }
    return credit;
  }
}

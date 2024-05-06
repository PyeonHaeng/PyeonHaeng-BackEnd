// src/credits/credits.controller.ts
import { Controller, Get, NotFoundException } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { Credit } from './entities/credit.entity';

@Controller('v2/credits')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Get()
  async getCredits(): Promise<Credit> {
    try {
      return this.creditsService.getCredits();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('The requested resource was not found');
      }
      throw error;
    }
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notice } from './entities/notice.entity';
import { Paginated } from 'src/common/pagination/pagination';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticesRepository: Repository<Notice>,
  ) {}

  async getNotices(offset: number, limit: number): Promise<Paginated<Notice>> {
    if (offset <= 0) {
      throw new BadRequestException('Offset must be greater than 0');
    }

    if (limit <= 0) {
      throw new BadRequestException('Limit must be greater than 0');
    }

    const [results, count] = await this.noticesRepository.findAndCount({
      skip: (offset - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      count,
      hasMore: offset * limit < count,
      results,
    };
  }

  async getNoticeById(id: number): Promise<Notice> {
    return this.noticesRepository.findOne({ where: { id: id } });
  }
}

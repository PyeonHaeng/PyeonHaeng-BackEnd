import { Controller, Get, Param, Query } from '@nestjs/common';
import { Paginated } from 'src/common/pagination/pagination';
import { NoticesService } from './notices.service';
import { Notice } from './entities/notice.entity';

@Controller('v2/notices')
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Get()
  async getNotices(
    @Query('offset', { transform: (value) => parseInt(value, 10) }) offset = 1,
    @Query('limit', { transform: (value) => parseInt(value, 10) }) limit = 10,
  ): Promise<Paginated<Notice>> {
    return this.noticesService.getNotices(offset, limit);
  }

  @Get(':id(\\d+)')
  async getNoticeById(@Param('id') id: number): Promise<Notice> {
    return this.noticesService.getNoticeById(id);
  }
}

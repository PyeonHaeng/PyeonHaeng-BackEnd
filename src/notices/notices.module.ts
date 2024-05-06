import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticesService } from './notices.service';
import { NoticesController } from './notices.controller';
import { Notice } from './entities/notice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notice])],
  providers: [NoticesService],
  controllers: [NoticesController],
})
export class NoticesModule {}

import {
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  IsNotEmpty,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SortOrder } from '../enums/sort-order.enum';
import { Promotion } from '../enums/promotion.enum';
import { Store } from '../enums/store.enum';
import { ApiProperty } from '@nestjs/swagger';

export class GetProductsDto {
  @ApiProperty({
    required: true,
    description: 'Promotion(BUY_ONE_GET_ONE_FREE, BUY_TWO_GET_ONE_FREE)',
    type: 'enum',
  })
  @IsNotEmpty()
  @IsEnum(Promotion)
  promotion: Promotion;

  @ApiProperty({
    required: true,
    description: 'Store(GS25, CU, EMART24, SEVEN_ELEVEN)',
    type: 'enum',
  })
  @IsNotEmpty()
  @IsEnum(Store)
  store: Store;

  @ApiProperty({
    required: true,
    description: 'The date must be declared in iso8601 (e.g. 2024-05-01)',
    type: Date,
  })
  @IsISO8601()
  date: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(SortOrder)
  sort?: SortOrder;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  offset = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(10)
  @Type(() => Number)
  limit = 10;
}

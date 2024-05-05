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

export class GetProductsDto {
  @IsOptional()
  @IsEnum(SortOrder)
  sort?: SortOrder;

  @IsNotEmpty()
  @IsEnum(Promotion)
  promotion: Promotion;

  @IsNotEmpty()
  @IsEnum(Store)
  store: Store;

  @IsNotEmpty()
  @IsISO8601()
  date: Date;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  offset = 1;

  @IsOptional()
  @IsInt()
  @Min(10)
  @Type(() => Number)
  limit = 10;
}

import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto<T> {
  @ApiProperty({ description: 'Total count of items' })
  count: number;

  @ApiProperty({ description: 'Indicates if there are more items' })
  hasMore: boolean;

  @ApiProperty({
    description: 'Array of items',
    type: 'array',
    items: { type: 'object' },
  })
  results: T[];
}

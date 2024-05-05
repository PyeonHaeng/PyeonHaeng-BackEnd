export interface Paginated<T> {
  count: number;
  hasMore: boolean;
  results: T[];
}

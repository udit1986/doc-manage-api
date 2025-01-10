import { IPaginationOptions } from './types/pagination-options';
import { InfinityPaginationResponseDto } from '../dto';

export const infinityPagination = <T>(
  data: T[],
  total: number,
  options: IPaginationOptions,
): InfinityPaginationResponseDto<T> => {
  return {
    data,
    hasNextPage: (options.page * options.limit) < total,
  };
};

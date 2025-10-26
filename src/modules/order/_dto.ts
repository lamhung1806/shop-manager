import { OptionalProperty } from 'src/shared/valitators';
import { PaginatedQuery } from '../common/_dto';

export class FindAllOrderDto extends PaginatedQuery {
  @OptionalProperty()
  startDate?: string;

  @OptionalProperty()
  endDate?: string;
}

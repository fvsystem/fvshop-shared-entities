import { Entity } from '@root/domain/entity';
// eslint-disable-next-line import/no-cycle
import { SearchResultProps } from './repository.types';

export class SearchResult<E extends Entity = Entity, Filter = string> {
  readonly items: E[];

  readonly total: number;

  readonly current_page: number;

  readonly per_page: number;

  readonly last_page: number;

  readonly sort: string | null;

  readonly sort_dir: string | null;

  readonly filter: Filter;

  constructor(props: SearchResultProps<E, Filter>) {
    this.items = props.items;
    this.total = props.total;
    this.current_page = props.current_page;
    this.per_page = props.per_page;
    this.last_page = Math.ceil(this.total / this.per_page);
    this.sort = props.sort;
    this.sort_dir = props.sort_dir;
    this.filter = props.filter;
  }

  toJSON(forceEntity = false) {
    return {
      items: forceEntity ? this.items.map((item) => item.toJSON()) : this.items,
      total: this.total,
      current_page: this.current_page,
      per_page: this.per_page,
      last_page: this.last_page,
      sort: this.sort,
      sort_dir: this.sort_dir,
      filter: this.filter,
    };
  }
}

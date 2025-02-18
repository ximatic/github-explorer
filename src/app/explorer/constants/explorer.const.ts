import { ExplorerPagination, ExplorerPaginationItemsKey, ExplorerPaginationCursorKey } from '../models/explorer.model';

export const DEFAULT_LANGUAGE = 'en';

export const DEFAULT_EXPLORER_PAGINATION: ExplorerPagination = {
  itemsKey: ExplorerPaginationItemsKey.First,
  itemsValue: 5,
  cursorKey: ExplorerPaginationCursorKey.After,
  cursorValue: null,
};

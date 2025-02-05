import { ExplorerPagination, ExplorerPaginationItemsKey, ExplorerPaginationCursorKey } from '../models/explorer.model';

export const DEFAULT_LANGUAGE = 'en';

export const defaultExplorerPagination: ExplorerPagination = {
  itemsKey: ExplorerPaginationItemsKey.First,
  itemsValue: 5,
  cursorKey: ExplorerPaginationCursorKey.After,
  cursorValue: null,
};

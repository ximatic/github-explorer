import { ExplorerPagination, ExplorerPaginationItemsKey, ExplorerPaginationCursorKey } from '../models/explorer.model';

export const defaultExplorerPagination: ExplorerPagination = {
  itemsKey: ExplorerPaginationItemsKey.First,
  itemsValue: 5,
  cursorKey: ExplorerPaginationCursorKey.After,
  cursorValue: null,
};

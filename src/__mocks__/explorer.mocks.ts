import { ExplorerPaginationItemsKey, ExplorerPaginationCursorKey } from '../app/explorer/models/explorer.model';

// common mocks

export const DEFAULT_TOKEN_1 = 'test-token-1';

export const DEFAULT_REPOSITORY_OWNER_1 = 'test-owner-1';

export const DEFAULT_REPOSITORY_NAME_1 = 'test-name-1';

// repository mocks

export const DEFAULT_REPOSITORY_1 = {
  owner: DEFAULT_REPOSITORY_OWNER_1,
  name: DEFAULT_REPOSITORY_NAME_1,
  stars: 0,
  createdAt: new Date(),
  description: 'test-description-1',
  url: 'test-url-1',
  issues: [],
};

// pagination mocks

export const DEFAULT_EXPLORER_PAGINATION_1 = {
  itemsKey: ExplorerPaginationItemsKey.First,
  itemsValue: 5,
  cursorKey: ExplorerPaginationCursorKey.After,
  cursorValue: null,
};

export const DEFAULT_EXPLORER_PAGE_INFO_1 = {
  itemsPerPage: 5,
  cursorStart: null,
  cursorEnd: null,
  hasNextPage: false,
  hasPreviousPage: false,
};

// store mocks

export const DEFAULT_INITIAL_EXPLORER_STATE = {
  token: null,
  repositories: null,
  repository: null,
  pageInfo: null,
};

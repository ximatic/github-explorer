import { ExplorerPaginationItemsKey, ExplorerPaginationCursorKey } from '../app/explorer/models/explorer.model';
import { ExplorerEvent, ExplorerEventName, ExplorerEventType } from '../app/explorer/store/explorer.state';

// common mocks

export const MOCK_TOKEN_1 = 'test-token-1';

export const MOCK_REPOSITORY_OWNER_1 = 'test-owner-1';

export const MOCK_REPOSITORY_NAME_1 = 'test-name-1';

// repository mocks

export const MOCK_REPOSITORY_1 = {
  owner: MOCK_REPOSITORY_OWNER_1,
  name: MOCK_REPOSITORY_NAME_1,
  stars: 0,
  createdAt: new Date(),
  description: 'test-description-1',
  url: 'test-url-1',
  issues: [],
};

// pagination mocks

export const MOCK_EXPLORER_PAGINATION_1 = {
  itemsKey: ExplorerPaginationItemsKey.First,
  itemsValue: 5,
  cursorKey: ExplorerPaginationCursorKey.After,
  cursorValue: null,
};

export const MOCK_EXPLORER_PAGE_INFO_1 = {
  itemsPerPage: 5,
  cursorStart: null,
  cursorEnd: null,
  hasNextPage: false,
  hasPreviousPage: false,
};

// event mocks

export const MOCK_EXPLORER_EVENT_VERIFY_TOKEN_PROCESSING: ExplorerEvent = {
  name: ExplorerEventName.VerifyToken,
  type: ExplorerEventType.Processing,
};

export const MOCK_EXPLORER_EVENT_VERIFY_TOKEN_SUCCESS: ExplorerEvent = {
  name: ExplorerEventName.VerifyToken,
  type: ExplorerEventType.Success,
};

export const MOCK_EXPLORER_EVENT_VERIFY_TOKEN_ERROR: ExplorerEvent = {
  name: ExplorerEventName.VerifyToken,
  type: ExplorerEventType.Error,
};

export const MOCK_EXPLORER_EVENT_LOAD_REPOSITORIES_PROCESSING: ExplorerEvent = {
  name: ExplorerEventName.LoadRepositories,
  type: ExplorerEventType.Processing,
};

export const MOCK_EXPLORER_EVENT_LOAD_REPOSITORIES_SUCCESS: ExplorerEvent = {
  name: ExplorerEventName.LoadRepositories,
  type: ExplorerEventType.Success,
};

export const MOCK_EXPLORER_EVENT_LOAD_REPOSITORIES_ERROR: ExplorerEvent = {
  name: ExplorerEventName.LoadRepositories,
  type: ExplorerEventType.Error,
};

export const MOCK_EXPLORER_EVENT_LOAD_REPOSITORY_PROCESSING: ExplorerEvent = {
  name: ExplorerEventName.LoadRepository,
  type: ExplorerEventType.Processing,
};

export const MOCK_EXPLORER_EVENT_LOAD_REPOSITORY_SUCCESS: ExplorerEvent = {
  name: ExplorerEventName.LoadRepository,
  type: ExplorerEventType.Success,
};

export const MOCK_EXPLORER_EVENT_LOAD_REPOSITORY_ERROR: ExplorerEvent = {
  name: ExplorerEventName.LoadRepository,
  type: ExplorerEventType.Error,
};

// store mocks

export const MOCK_INITIAL_EXPLORER_STATE = {
  token: null,
  repositories: null,
  repository: null,
  pageInfo: null,
  error: null,
};

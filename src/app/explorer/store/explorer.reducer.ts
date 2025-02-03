import { createReducer, on } from '@ngrx/store';

import { explorerActions } from './explorer.actions';
import { ExplorerState } from './explorer.state';

export const initialState: ExplorerState = {
  token: null,
  repositories: null,
  repository: null,
  pageInfo: null,
};

export const explorerReducer = createReducer(
  initialState,
  on(explorerActions.reset, () => initialState),
  on(explorerActions.token, (state: ExplorerState, { token }) => ({
    ...state,
    token,
    repositories: null,
    repository: null,
    pageInfo: null,
  })),
  on(explorerActions.repositories, (state: ExplorerState, { repositories }) => ({
    ...state,
    repositories,
    repository: null,
  })),
  on(explorerActions.repository, (state: ExplorerState, { repository }) => ({
    ...state,
    repository: repository,
  })),
  on(explorerActions.pageInfo, (state: ExplorerState, { pageInfo }) => ({
    ...state,
    pageInfo,
  })),
);

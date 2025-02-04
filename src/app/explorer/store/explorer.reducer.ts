import { createReducer, on } from '@ngrx/store';

import { explorerActions } from './explorer.actions';
import { ExplorerState } from './explorer.state';

export const initialState: ExplorerState = {
  token: null,
  repositories: null,
  repository: null,
  pageInfo: null,
  error: null,
};

export const explorerReducer = createReducer(
  initialState,
  on(explorerActions.reset, () => initialState),
  on(explorerActions.tokenVerify, (state: ExplorerState) => ({
    ...state,
    token: null,
    repositories: null,
    repository: null,
    pageInfo: null,
    error: null,
  })),
  on(explorerActions.tokenVerifySuccess, (state: ExplorerState, { token }) => ({
    ...state,
    token,
    repositories: null,
    repository: null,
    pageInfo: null,
  })),
  on(explorerActions.tokenVerifyError, (state: ExplorerState, { error }) => ({
    ...state,
    token: null,
    repositories: null,
    repository: null,
    pageInfo: null,
    error: error,
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

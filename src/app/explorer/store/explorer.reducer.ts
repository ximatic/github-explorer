import { createReducer, on } from '@ngrx/store';

import { explorerActions } from './explorer.actions';
import { ExplorerEventName, ExplorerEventType, ExplorerState } from './explorer.state';

export const initialState: ExplorerState = {
  token: null,
  repositories: null,
  repository: null,
  pageInfo: null,
  event: null,
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
    event: {
      name: ExplorerEventName.VerifyToken,
      type: ExplorerEventType.Processing,
    },
  })),
  on(explorerActions.tokenVerifySuccess, (state: ExplorerState, { token }) => ({
    ...state,
    token,
    repositories: null,
    repository: null,
    pageInfo: null,
    event: {
      name: ExplorerEventName.VerifyToken,
      type: ExplorerEventType.Success,
    },
  })),
  on(explorerActions.tokenVerifyError, (state: ExplorerState, { error }) => ({
    ...state,
    token: null,
    repositories: null,
    repository: null,
    pageInfo: null,
    event: {
      name: ExplorerEventName.VerifyToken,
      type: ExplorerEventType.Error,
      message: error,
    },
  })),

  // load repositories
  on(explorerActions.loadRepositories, (state: ExplorerState) => ({
    ...state,
    event: {
      name: ExplorerEventName.LoadRepositories,
      type: ExplorerEventType.Processing,
    },
  })),
  on(explorerActions.loadRepositoriesSuccess, (state: ExplorerState, { repositories }) => ({
    ...state,
    repositories,
    event: {
      name: ExplorerEventName.LoadRepositories,
      type: ExplorerEventType.Success,
    },
  })),
  on(explorerActions.loadRepositoriesError, (state: ExplorerState, { error }) => ({
    ...state,
    event: {
      name: ExplorerEventName.LoadRepositories,
      type: ExplorerEventType.Error,
      message: error,
    },
  })),

  // load repository
  on(explorerActions.loadRepository, (state: ExplorerState) => ({
    ...state,
    event: {
      name: ExplorerEventName.LoadRepository,
      type: ExplorerEventType.Processing,
    },
  })),
  on(explorerActions.loadRepositorySuccess, (state: ExplorerState, { repository }) => ({
    ...state,
    repository,
    event: {
      name: ExplorerEventName.LoadRepository,
      type: ExplorerEventType.Success,
    },
  })),
  on(explorerActions.loadRepositoryError, (state: ExplorerState, { error }) => ({
    ...state,
    event: {
      name: ExplorerEventName.LoadRepository,
      type: ExplorerEventType.Error,
      message: error,
    },
  })),

  // page info
  on(explorerActions.pageInfo, (state: ExplorerState, { pageInfo }) => ({
    ...state,
    pageInfo,
  })),
);

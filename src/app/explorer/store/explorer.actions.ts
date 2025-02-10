import { createAction, props } from '@ngrx/store';

import { ExplorerPageInfo, ExplorerPagination, Repository } from '../models/explorer.model';
import { ExplorerError } from './explorer.errors';

export enum ExplorerAction {
  Reset = 'explorer/reset',
  ResetToken = 'explorer/resetToken',
  TokenVerify = 'explorer/tokenVerify',
  TokenVerifySuccess = 'explorer/tokenVerifySuccess',
  TokenVerifyError = 'explorer/tokenVerifyError',
  LoadRepositories = 'explorer/loadRepositories',
  LoadRepositoriesSuccess = 'explorer/loadRepositoriesSuccess',
  LoadRepositoriesError = 'explorer/loadRepositoriesError',
  LoadRepository = 'explorer/loadRepository',
  LoadRepositorySuccess = 'explorer/loadRepositorySuccess',
  LoadRepositoryError = 'explorer/loadRepositoryError',
  PageInfo = 'explorer/pageInfo',
}

export interface ActionPropsToken {
  token: string;
}

export interface ActionPropsError {
  error: ExplorerError;
}

export interface ActionPropsTokenVerify extends ActionPropsToken {
  storeToken?: boolean;
}

export interface ActionPropsRepositoriesRequest {
  pagination?: ExplorerPagination;
}

export interface ActionPropsRepositories {
  repositories: Repository[];
}

export interface ActionPropsRepositoryRequest {
  owner: string;
  name: string;
  pagination?: ExplorerPagination;
}

export interface ActionPropsRepository {
  repository: Repository;
}

export interface ActionPropsPageInfo {
  pageInfo: ExplorerPageInfo;
}

export const explorerActions = {
  reset: createAction(ExplorerAction.Reset),
  resetToken: createAction(ExplorerAction.ResetToken),
  tokenVerify: createAction(ExplorerAction.TokenVerify, props<ActionPropsTokenVerify>()),
  tokenVerifySuccess: createAction(ExplorerAction.TokenVerifySuccess, props<ActionPropsToken>()),
  tokenVerifyError: createAction(ExplorerAction.TokenVerifyError, props<ActionPropsError>()),
  loadRepositories: createAction(ExplorerAction.LoadRepositories, props<ActionPropsRepositoriesRequest>()),
  loadRepositoriesSuccess: createAction(ExplorerAction.LoadRepositoriesSuccess, props<ActionPropsRepositories>()),
  loadRepositoriesError: createAction(ExplorerAction.LoadRepositoriesError, props<ActionPropsError>()),
  loadRepository: createAction(ExplorerAction.LoadRepository, props<ActionPropsRepositoryRequest>()),
  loadRepositorySuccess: createAction(ExplorerAction.LoadRepositorySuccess, props<ActionPropsRepository>()),
  loadRepositoryError: createAction(ExplorerAction.LoadRepositoryError, props<ActionPropsError>()),
  pageInfo: createAction(ExplorerAction.PageInfo, props<ActionPropsPageInfo>()),
};

import { createAction, props } from '@ngrx/store';

import { ExplorerPageInfo, ExplorerPagination, Repository } from '../models/explorer.model';
import { ExplorerError } from './explorer.errors';

export enum ExplorerAction {
  Reset = 'explorer/reset',
  ResetToken = 'explorer/resetToken',
  TokenVerify = 'explorer/tokenVerify',
  TokenVerifySuccess = 'explorer/tokenVerifySuccess',
  TokenVerifyError = 'explorer/tokenVerifyError',
  Token = 'explorer/token',
  RepositoriesRequest = 'explorer/repositoriesRequest',
  Repositories = 'explorer/repositories',
  RepositoryRequest = 'explorer/repositoryRequest',
  Repository = 'explorer/repository',
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
  token: createAction(ExplorerAction.Token, props<ActionPropsToken>()),
  repositoriesRequest: createAction(ExplorerAction.RepositoriesRequest, props<ActionPropsRepositoriesRequest>()),
  repositories: createAction(ExplorerAction.Repositories, props<ActionPropsRepositories>()),
  repositoryRequest: createAction(ExplorerAction.RepositoryRequest, props<ActionPropsRepositoryRequest>()),
  repository: createAction(ExplorerAction.Repository, props<ActionPropsRepository>()),
  pageInfo: createAction(ExplorerAction.PageInfo, props<ActionPropsPageInfo>()),
};

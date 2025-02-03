import { createAction, props } from '@ngrx/store';

import { ExplorerPageInfo, ExplorerPagination, Repository } from '../models/explorer.model';

export enum ExplorerAction {
  Reset = 'explorer/reset',
  TokenVerify = 'explorer/tokenVerify',
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
  tokenVerify: createAction(ExplorerAction.TokenVerify, props<ActionPropsToken>()),
  token: createAction(ExplorerAction.Token, props<ActionPropsToken>()),
  repositoriesRequest: createAction(ExplorerAction.RepositoriesRequest, props<ActionPropsRepositoriesRequest>()),
  repositories: createAction(ExplorerAction.Repositories, props<ActionPropsRepositories>()),
  repositoryRequest: createAction(ExplorerAction.RepositoryRequest, props<ActionPropsRepositoryRequest>()),
  repository: createAction(ExplorerAction.Repository, props<ActionPropsRepository>()),
  pageInfo: createAction(ExplorerAction.PageInfo, props<ActionPropsPageInfo>()),
};

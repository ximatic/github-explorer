import { ExplorerPageInfo, Repository } from '../models/explorer.model';

import { ExplorerError } from './explorer.errors';

export enum ExplorerEventName {
  VerifyToken = 'verify-token',
  LoadRepositories = 'load-repositories',
  LoadRepository = 'load-repository',
}

export enum ExplorerEventType {
  Processing = 'processing',
  Success = 'success',
  Error = 'error',
}

export interface ExplorerEvent {
  name: ExplorerEventName;
  type: ExplorerEventType;
  message?: string | ExplorerError;
}

export interface ExplorerState {
  token: string | null;
  repositories: Repository[] | null;
  repository: Repository | null;
  pageInfo: ExplorerPageInfo | null;
  event: ExplorerEvent | null;
}

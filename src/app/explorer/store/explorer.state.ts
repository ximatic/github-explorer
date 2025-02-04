import { ExplorerPageInfo, Repository } from '../models/explorer.model';

import { ExplorerError } from './explorer.errors';

export interface ExplorerState {
  token: string | null;
  repositories: Repository[] | null;
  repository: Repository | null;
  pageInfo: ExplorerPageInfo | null;
  error: ExplorerError | null;
}

import { ExplorerPageInfo, Repository } from '../models/explorer.model';

export interface ExplorerState {
  token: string | null;
  repositories: Repository[] | null;
  repository: Repository | null;
  pageInfo: ExplorerPageInfo | null;
}

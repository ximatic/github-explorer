import { Routes } from '@angular/router';

import { ExplorerTokenGuard } from './explorer/utils/explorer-token.guard';

import { TokenComponent } from './explorer/components/token/token.component';
import { RepositoriesComponent } from './explorer/components/repositories/repositories.component';
import { RepositoryComponent } from './explorer/components/repository/repository.component';

export const routes: Routes = [
  {
    path: '',
    component: TokenComponent,
  },
  {
    path: 'repositories',
    canActivate: [ExplorerTokenGuard],
    component: RepositoriesComponent,
  },
  {
    path: ':owner/:name',
    canActivate: [ExplorerTokenGuard],
    component: RepositoryComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

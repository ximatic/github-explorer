import { inject, Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';

import { map, catchError, switchMap, exhaustMap } from 'rxjs/operators';

import { ExplorerService } from '../services/explorer.service';

import { defaultExplorerPagination, RepositoriesResponse, RepositoryResponse } from '../models/explorer.model';

import {
  ActionPropsRepositoriesRequest,
  ActionPropsRepositoryRequest,
  ActionPropsToken,
  ExplorerAction,
  explorerActions,
} from './explorer.actions';

@Injectable()
export class ExplorerEffects {
  private actions$ = inject(Actions);
  private explorerService = inject(ExplorerService);

  verifyToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExplorerAction.TokenVerify),
      exhaustMap((action: ActionPropsToken) =>
        this.explorerService.verifyToken(action.token).pipe(
          map((result: boolean) => explorerActions.token({ token: result ? action.token : '' })),
          catchError(() => of(explorerActions.token({ token: '' }))),
        ),
      ),
    ),
  );

  loadRepositories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExplorerAction.RepositoriesRequest),
      exhaustMap((action: ActionPropsRepositoriesRequest) =>
        this.explorerService
          .loadRepositories(action.pagination || defaultExplorerPagination)
          .pipe(
            switchMap((repositoriesResponse: RepositoriesResponse) =>
              of(
                explorerActions.pageInfo({ pageInfo: repositoriesResponse.pageInfo }),
                explorerActions.repositories({ repositories: repositoriesResponse.repositories }),
              ),
            ),
          ),
      ),
    ),
  );

  loadRepository$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExplorerAction.RepositoryRequest),
      exhaustMap((action: ActionPropsRepositoryRequest) =>
        this.explorerService
          .loadRepository(action.owner, action.name, action.pagination || defaultExplorerPagination)
          .pipe(
            switchMap((repositoryResponse: RepositoryResponse) =>
              of(
                explorerActions.pageInfo({ pageInfo: repositoryResponse.pageInfo }),
                explorerActions.repository({ repository: repositoryResponse.repository }),
              ),
            ),
          ),
      ),
    ),
  );
}

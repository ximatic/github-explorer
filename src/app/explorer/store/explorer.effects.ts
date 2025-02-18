import { inject, Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';

import { map, catchError, switchMap, exhaustMap } from 'rxjs/operators';

import { ExplorerService } from '../services/explorer.service';

import { DEFAULT_EXPLORER_PAGINATION } from '../constants/explorer.const';

import { RepositoriesResponse, RepositoryResponse } from '../models/explorer.model';

import {
  ActionPropsRepositoriesRequest,
  ActionPropsRepositoryRequest,
  ActionPropsTokenVerify,
  ExplorerAction,
  explorerActions,
} from './explorer.actions';
import { ExplorerError } from './explorer.errors';

@Injectable()
export class ExplorerEffects {
  private actions$ = inject(Actions);
  private explorerService = inject(ExplorerService);

  verifyToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExplorerAction.TokenVerify),
      exhaustMap((action: ActionPropsTokenVerify) =>
        this.explorerService.verifyToken(action.token, action.storeToken).pipe(
          map((result: boolean) =>
            result
              ? explorerActions.tokenVerifySuccess({ token: action.token })
              : explorerActions.tokenVerifyError({ error: ExplorerError.InvalidToken }),
          ),
          catchError(() => of(explorerActions.tokenVerifyError({ error: ExplorerError.InvalidToken }))),
        ),
      ),
    ),
  );

  resetToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExplorerAction.ResetToken),
      exhaustMap(() => {
        this.explorerService.resetToken();
        return of(explorerActions.reset());
      }),
    ),
  );

  loadRepositories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExplorerAction.LoadRepositories),
      exhaustMap((action: ActionPropsRepositoriesRequest) =>
        this.explorerService.loadRepositories(action.pagination || DEFAULT_EXPLORER_PAGINATION).pipe(
          switchMap((repositoriesResponse: RepositoriesResponse) =>
            of(
              explorerActions.pageInfo({ pageInfo: repositoriesResponse.pageInfo }),
              explorerActions.loadRepositoriesSuccess({ repositories: repositoriesResponse.repositories }),
            ),
          ),
          catchError(() => of(explorerActions.loadRepositoriesError({ error: ExplorerError.LoadRepositories }))),
        ),
      ),
    ),
  );

  loadRepository$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExplorerAction.LoadRepository),
      exhaustMap((action: ActionPropsRepositoryRequest) =>
        this.explorerService.loadRepository(action.owner, action.name, action.pagination || DEFAULT_EXPLORER_PAGINATION).pipe(
          switchMap((repositoryResponse: RepositoryResponse) =>
            of(
              explorerActions.pageInfo({ pageInfo: repositoryResponse.pageInfo }),
              explorerActions.loadRepositorySuccess({ repository: repositoryResponse.repository }),
            ),
          ),
          catchError(() => of(explorerActions.loadRepositoryError({ error: ExplorerError.LoadRepository }))),
        ),
      ),
    ),
  );
}

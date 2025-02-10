import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ExplorerState } from './explorer.state';

export const selectExplorerState = createFeatureSelector<ExplorerState>('explorer');

export const selectExplorerEvent = createSelector(selectExplorerState, (state: ExplorerState) => state.event);

export const selectExplorerToken = createSelector(selectExplorerState, (state: ExplorerState) => state.token);

export const selectExplorerRepositories = createSelector(selectExplorerState, (state: ExplorerState) => state.repositories);

export const selectExplorerRepository = createSelector(selectExplorerState, (state: ExplorerState) => state.repository);

export const selectExplorerPageInfo = createSelector(selectExplorerState, (state: ExplorerState) => state.pageInfo);

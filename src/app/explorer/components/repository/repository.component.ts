import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { ExplorerPagination, Repository } from '../../models/explorer.model';

import { explorerActions } from '../../store/explorer.actions';
import { selectExplorerRepository } from '../../store/explorer.selectors';
import { ExplorerState } from '../../store/explorer.state';

import { PaginationComponent } from '../pagination/pagination.component';
import { RepositoryInfoComponent } from '../repository-info/repository-info.component';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrl: './repository.component.scss',
  standalone: true,
  imports: [
    // Angular imports
    CommonModule,
    RouterModule,
    // 3rd party imports
    TranslatePipe,
    ButtonModule,
    DividerModule,
    PanelModule,
    ProgressSpinnerModule,
    // other
    RepositoryInfoComponent,
    PaginationComponent,
  ],
})
export class RepositoryComponent implements OnInit, OnDestroy {
  // ngrx
  repository$!: Observable<Repository | null>;

  repository: Repository | null = null;

  // state flags
  isDataLoading = true;

  // route params
  private owner?: string;
  private name?: string;

  // other
  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private store: Store<ExplorerState>,
  ) {}

  // lifecycle methods

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // pagination

  onPaginationChange(pagination: ExplorerPagination): void {
    this.isDataLoading = true;
    this.dispatchRepositoryRequest(pagination);
  }

  // initialization

  private init(): void {
    this.initState();
    this.initParams();
  }

  private initState(): void {
    this.repository$ = this.store.select(selectExplorerRepository);
    this.subscription.add(
      this.repository$.subscribe((repository: Repository | null) => {
        this.repository = repository;

        this.isDataLoading = false;
      }),
    );
  }

  private initParams(): void {
    this.subscription.add(
      this.route.params.subscribe((params: Params) => {
        this.owner = params['owner'];
        this.name = params['name'];
        this.dispatchRepositoryRequest();
      }),
    );
  }

  private dispatchRepositoryRequest(pagination?: ExplorerPagination): void {
    if (this.owner && this.name) {
      this.store.dispatch(
        explorerActions.repositoryRequest({
          owner: this.owner,
          name: this.name,
          pagination,
        }),
      );
    }
  }
}

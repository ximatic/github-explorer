import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';

import { ExplorerPagination, Repository } from '../../models/explorer.model';

import { explorerActions } from '../../store/explorer.actions';
import { selectExplorerEvent, selectExplorerRepositories } from '../../store/explorer.selectors';
import { ExplorerEvent, ExplorerEventName, ExplorerEventType, ExplorerState } from '../../store/explorer.state';

import { PaginationComponent } from '../pagination/pagination.component';
import { RepositoryInfoComponent } from '../repository-info/repository-info.component';

@Component({
  selector: 'app-repositories',
  templateUrl: './repositories.component.html',
  styleUrl: './repositories.component.scss',
  imports: [
    // Angular imports
    CommonModule,
    RouterModule,
    // 3rd party imports
    TranslatePipe,
    ButtonModule,
    ProgressSpinnerModule,
    PanelModule,
    SelectModule,
    // other
    RepositoryInfoComponent,
    PaginationComponent,
  ],
})
export class RepositoriesComponent implements OnInit, OnDestroy {
  // ngrx
  repositories$!: Observable<Repository[] | null>;
  explorerEvent$!: Observable<ExplorerEvent | null>;

  // state flags
  isDataLoading = true;

  // other
  private subscription = new Subscription();

  constructor(
    private router: Router,
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
    this.dispatchRepositoriesRequest(pagination);
  }

  // repositories

  repositoryClick(repository: Repository): void {
    if (this.isDataLoading) {
      return;
    }
    this.router.navigate([`${repository.owner}/${repository.name}`]);
  }

  private dispatchRepositoriesRequest(pagination?: ExplorerPagination): void {
    this.store.dispatch(explorerActions.loadRepositories({ pagination }));
  }

  // initialization

  private init(): void {
    this.dispatchRepositoriesRequest();
    this.initState();
  }

  private initState(): void {
    this.repositories$ = this.store.select(selectExplorerRepositories);
    this.subscription.add(
      this.repositories$.subscribe((repositories: Repository[] | null) => {
        if (!repositories) {
          return;
        }

        this.isDataLoading = false;
      }),
    );

    this.explorerEvent$ = this.store.select(selectExplorerEvent);
    this.subscription.add(
      this.explorerEvent$.subscribe((explorerEvent: ExplorerEvent | null) => {
        if (!explorerEvent) {
          return;
        }

        if (explorerEvent.name === ExplorerEventName.LoadRepositories && explorerEvent.type === ExplorerEventType.Error) {
          this.isDataLoading = false;
        }
      }),
    );
  }
}

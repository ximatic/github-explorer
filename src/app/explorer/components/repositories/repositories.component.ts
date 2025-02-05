import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, skip, Subscription } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';

import { ExplorerPagination, Repository } from '../../models/explorer.model';

import { explorerActions } from '../../store/explorer.actions';
import { selectExplorerRepositories } from '../../store/explorer.selectors';
import { ExplorerState } from '../../store/explorer.state';

import { PaginationComponent } from '../pagination/pagination.component';
import { RepositoryInfoComponent } from '../repository-info/repository-info.component';

@Component({
  selector: 'app-repositories',
  templateUrl: './repositories.component.html',
  styleUrl: './repositories.component.scss',
  standalone: true,
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
    this.store.dispatch(explorerActions.repositoriesRequest({ pagination }));
  }

  // repositories

  repositoryClick(repository: Repository): void {
    if (this.isDataLoading) {
      return;
    }
    this.router.navigate([`${repository.owner}/${repository.name}`]);
  }

  // initialization

  private init(): void {
    this.store.dispatch(explorerActions.repositoriesRequest({}));

    this.repositories$ = this.store.select(selectExplorerRepositories);
    this.subscription.add(
      this.repositories$.pipe(skip(1)).subscribe(() => {
        this.isDataLoading = false;
      }),
    );
  }
}

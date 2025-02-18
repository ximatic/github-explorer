import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

import { DEFAULT_EXPLORER_PAGINATION } from '../../constants/explorer.const';

import {
  ExplorerPageInfo,
  ExplorerPagination,
  ExplorerPaginationCursorKey,
  ExplorerPaginationItemsKey,
} from '../../models/explorer.model';

import { selectExplorerPageInfo } from '../../store/explorer.selectors';
import { ExplorerState } from '../../store/explorer.state';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  imports: [CommonModule, FormsModule, ButtonModule, SelectModule],
})
export class PaginationComponent implements OnInit, OnDestroy {
  @Output() paginationChange = new EventEmitter<ExplorerPagination>();

  // ngrx
  pageInfo$!: Observable<ExplorerPageInfo | null>;

  pageInfo: ExplorerPageInfo | null = null;

  // state flags
  isChangeInProgress = false;

  // pagination
  paginationOptions = [
    {
      name: '5',
      code: 5,
    },
    {
      name: '10',
      code: 10,
    },
    {
      name: '25',
      code: 25,
    },
    {
      name: '50',
      code: 50,
    },
  ];
  itemsPerPage = DEFAULT_EXPLORER_PAGINATION.itemsValue;
  pagination: ExplorerPagination = DEFAULT_EXPLORER_PAGINATION;

  // other
  private subscription = new Subscription();

  constructor(private store: Store<ExplorerState>) {}

  // lifecycle methods

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // pagination

  previousPage(): void {
    if (!this.pageInfo) {
      return;
    }

    this.pagination = {
      itemsKey: ExplorerPaginationItemsKey.Last,
      itemsValue: this.itemsPerPage,
      cursorKey: ExplorerPaginationCursorKey.Before,
      cursorValue: `"${this.pageInfo.cursorStart}"`,
    };
    this.updatePagination();
  }

  nextPage(): void {
    if (!this.pageInfo) {
      return;
    }

    this.pagination = {
      itemsKey: ExplorerPaginationItemsKey.First,
      itemsValue: this.itemsPerPage,
      cursorKey: ExplorerPaginationCursorKey.After,
      cursorValue: `"${this.pageInfo.cursorEnd}"`,
    };
    this.updatePagination();
  }

  onItemsPerPageChanged(itemsPerPage: number): void {
    if (!this.pageInfo) {
      return;
    }

    // reset to default pagination and change itemsValue
    this.pagination = {
      ...DEFAULT_EXPLORER_PAGINATION,
      itemsValue: itemsPerPage,
    };
    this.updatePagination();
  }

  private updatePagination(): void {
    this.isChangeInProgress = true;
    this.paginationChange.emit(this.pagination);
  }

  // initialization

  private init(): void {
    this.pageInfo$ = this.store.select(selectExplorerPageInfo);
    this.subscription.add(
      this.pageInfo$.subscribe((pageInfo: ExplorerPageInfo | null) => {
        if (!pageInfo) {
          return;
        }

        this.pageInfo = pageInfo;
        this.itemsPerPage = pageInfo.itemsPerPage;
        this.isChangeInProgress = false;
      }),
    );
  }
}

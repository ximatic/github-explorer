import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ToolbarModule } from 'primeng/toolbar';

import { explorerActions } from '../explorer/store/explorer.actions';
import { selectExplorerToken } from '../explorer/store/explorer.selectors';
import { ExplorerState } from '../explorer/store/explorer.state';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, ToolbarModule],
})
export class MainComponent implements OnInit {
  // ngrx
  token$!: Observable<string | null>;

  constructor(private store: Store<ExplorerState>) {}

  // lifecycle methods

  ngOnInit(): void {
    this.init();
  }

  // user interactions

  resetToken(): void {
    this.store.dispatch(explorerActions.resetToken());
  }

  // initialization

  private init(): void {
    this.token$ = this.store.select(selectExplorerToken);
  }
}

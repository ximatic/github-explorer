import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';

import { selectExplorerToken } from '../store/explorer.selectors';
import { ExplorerState } from '../store/explorer.state';

@Injectable({
  providedIn: 'root',
})
export class ExplorerTokenGuard implements CanActivate {
  constructor(
    private router: Router,
    private store: Store<ExplorerState>,
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.select(selectExplorerToken).pipe(
      take(1),
      map((token: string | null) => {
        if (!token) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      }),
    );
  }
}

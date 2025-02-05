/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { MOCK_INITIAL_EXPLORER_STATE, MOCK_TOKEN_1 } from '../../../__mocks__/explorer.mocks';

import { selectExplorerToken } from '../store/explorer.selectors';

import { ExplorerTokenGuard } from './explorer-token.guard';

describe('ExplorerTokenGuard', () => {
  let guard: ExplorerTokenGuard;
  let router: Router;
  let store: MockStore;

  let mockExplorerTokenSelector: any;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideMockStore({ initialState: MOCK_INITIAL_EXPLORER_STATE }), ExplorerTokenGuard],
    });

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);

    mockExplorerTokenSelector = store.overrideSelector(selectExplorerToken, null);
  });

  beforeEach(() => {
    guard = TestBed.inject(ExplorerTokenGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  // auth token

  describe('canActivate()', () => {
    it('handling null Token works', (done) => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      mockExplorerTokenSelector.setResult(null);

      store.refreshState();

      guard.canActivate().subscribe((result: any) => {
        expect(result).toBeFalsy();
        expect(navigateSpy).toHaveBeenCalledWith([`/`]);
        done();
      });
    });

    it('handling exisiting Token works', (done) => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      mockExplorerTokenSelector.setResult(MOCK_TOKEN_1);

      store.refreshState();

      guard.canActivate().subscribe((result: any) => {
        expect(result).toBeTruthy();
        expect(navigateSpy).toHaveBeenCalledTimes(0);
        done();
      });
    });
  });
});

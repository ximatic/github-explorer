/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, Router } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { MOCK_EXPLORER_PAGINATION_1, MOCK_INITIAL_EXPLORER_STATE, MOCK_REPOSITORY_1 } from '../../../../__mocks__/explorer.mocks';

import { Repository } from '../../models/explorer.model';

import { ExplorerAction } from '../../store/explorer.actions';
import { selectExplorerRepositories } from '../../store/explorer.selectors';

import { RepositoriesComponent } from './repositories.component';

describe('RepositoriesComponent', () => {
  let component: RepositoriesComponent;
  let fixture: ComponentFixture<RepositoriesComponent>;

  let router: Router;
  let store: MockStore;
  let mockExplorerRepositoriesSelector: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoriesComponent],
      providers: [provideRouter([]), provideAnimationsAsync(), provideMockStore({ initialState: MOCK_INITIAL_EXPLORER_STATE })],
    }).compileComponents();

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    mockExplorerRepositoriesSelector = store.overrideSelector(selectExplorerRepositories, null);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositoriesComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('handling repositories works', (done) => {
    fixture.detectChanges();

    mockExplorerRepositoriesSelector.setResult([MOCK_REPOSITORY_1]);

    store.refreshState();

    component.repositories$.subscribe((repositories: Repository[] | null) => {
      expect(repositories).toEqual([MOCK_REPOSITORY_1]);
      done();
    });
  });

  it('handling pagination works', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    component.onPaginationChange(MOCK_EXPLORER_PAGINATION_1);

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: ExplorerAction.RepositoriesRequest,
      pagination: MOCK_EXPLORER_PAGINATION_1,
    });
  });

  it('redirecting to repository works', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    fixture.detectChanges();

    component.isDataLoading = false;
    component.repositoryClick(MOCK_REPOSITORY_1);

    expect(navigateSpy).toHaveBeenCalledWith([`${MOCK_REPOSITORY_1.owner}/${MOCK_REPOSITORY_1.name}`]);
  });

  it('redirecting to repository does not work when data is loading', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    fixture.detectChanges();

    component.repositoryClick(MOCK_REPOSITORY_1);

    expect(navigateSpy).toHaveBeenCalledTimes(0);
  });
});

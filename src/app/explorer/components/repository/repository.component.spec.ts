/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import {
  MOCK_EXPLORER_EVENT_LOAD_REPOSITORY_ERROR,
  MOCK_EXPLORER_EVENT_LOAD_REPOSITORY_SUCCESS,
  MOCK_EXPLORER_PAGINATION_1,
  MOCK_INITIAL_EXPLORER_STATE,
  MOCK_REPOSITORY_1,
  MOCK_REPOSITORY_NAME_1,
  MOCK_REPOSITORY_OWNER_1,
} from '../../../../__mocks__/explorer.mocks';

import { Repository } from '../../models/explorer.model';

import { ExplorerAction } from '../../store/explorer.actions';
import { selectExplorerEvent, selectExplorerRepository } from '../../store/explorer.selectors';

import { RepositoryComponent } from './repository.component';

describe('RepositoryComponent', () => {
  let component: RepositoryComponent;
  let fixture: ComponentFixture<RepositoryComponent>;

  let store: MockStore;
  let mockExplorerRepositorySelector: any;
  let mockExplorerEventSelector: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoryComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              owner: MOCK_REPOSITORY_OWNER_1,
              name: MOCK_REPOSITORY_NAME_1,
            }),
          },
        },
        provideTranslateService(),
        provideMockStore({ initialState: MOCK_INITIAL_EXPLORER_STATE }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    mockExplorerRepositorySelector = store.overrideSelector(selectExplorerRepository, null);
    mockExplorerEventSelector = store.overrideSelector(selectExplorerEvent, null);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositoryComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('handling repository works', () => {
    fixture.detectChanges();

    mockExplorerRepositorySelector.setResult(MOCK_REPOSITORY_1);

    store.refreshState();

    expect(component.repository).toEqual(MOCK_REPOSITORY_1);
    expect(component.isDataLoading).toEqual(false);
  });

  it('handling null repository works', (done) => {
    fixture.detectChanges();

    mockExplorerRepositorySelector.setResult(null);

    store.refreshState();

    component.repository$.subscribe((repository: Repository | null) => {
      expect(repository).toEqual(null);
      expect(component.isDataLoading).toEqual(true);
      done();
    });
  });

  it('handling explorer event Load Repository / Success works', () => {
    fixture.detectChanges();

    mockExplorerEventSelector.setResult(MOCK_EXPLORER_EVENT_LOAD_REPOSITORY_SUCCESS);

    store.refreshState();

    expect(component.isDataLoading).toEqual(true);
  });

  it('handling explorer event Load Repository / Error works', () => {
    fixture.detectChanges();

    mockExplorerEventSelector.setResult(MOCK_EXPLORER_EVENT_LOAD_REPOSITORY_ERROR);

    store.refreshState();

    expect(component.isDataLoading).toEqual(false);
  });

  it('handling pagination works', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    component.onPaginationChange(MOCK_EXPLORER_PAGINATION_1);

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: ExplorerAction.LoadRepository,
      owner: MOCK_REPOSITORY_OWNER_1,
      name: MOCK_REPOSITORY_NAME_1,
      pagination: MOCK_EXPLORER_PAGINATION_1,
    });
  });

  it('handling route params works', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: ExplorerAction.LoadRepository,
      owner: MOCK_REPOSITORY_OWNER_1,
      name: MOCK_REPOSITORY_NAME_1,
    });
  });
});

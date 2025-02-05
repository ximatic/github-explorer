/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import {
  MOCK_EXPLORER_PAGINATION_1,
  MOCK_INITIAL_EXPLORER_STATE,
  MOCK_REPOSITORY_1,
  MOCK_REPOSITORY_NAME_1,
  MOCK_REPOSITORY_OWNER_1,
} from '../../../../__mocks__/explorer.mocks';

import { ExplorerAction } from '../../store/explorer.actions';
import { selectExplorerRepository } from '../../store/explorer.selectors';

import { RepositoryComponent } from './repository.component';

describe('RepositoryComponent', () => {
  let component: RepositoryComponent;
  let fixture: ComponentFixture<RepositoryComponent>;

  let store: MockStore;
  let mockExplorerRepositorySelector: any;

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
  });

  it('handling pagination works', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    component.onPaginationChange(MOCK_EXPLORER_PAGINATION_1);

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: ExplorerAction.RepositoryRequest,
      owner: MOCK_REPOSITORY_OWNER_1,
      name: MOCK_REPOSITORY_NAME_1,
      pagination: MOCK_EXPLORER_PAGINATION_1,
    });
  });

  it('handling route params works', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: ExplorerAction.RepositoryRequest,
      owner: MOCK_REPOSITORY_OWNER_1,
      name: MOCK_REPOSITORY_NAME_1,
    });
  });
});

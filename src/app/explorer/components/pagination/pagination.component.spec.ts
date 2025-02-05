/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import {
  MOCK_EXPLORER_PAGE_INFO_1,
  MOCK_EXPLORER_PAGINATION_1,
  MOCK_INITIAL_EXPLORER_STATE,
} from '../../../../__mocks__/explorer.mocks';

import { ExplorerPageInfo, ExplorerPaginationCursorKey, ExplorerPaginationItemsKey } from '../../models/explorer.model';

import { selectExplorerPageInfo } from '../../store/explorer.selectors';

import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  let store: MockStore;
  let mockExplorerPageInfoSelector: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
      providers: [provideMockStore({ initialState: MOCK_INITIAL_EXPLORER_STATE })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    mockExplorerPageInfoSelector = store.overrideSelector(selectExplorerPageInfo, null);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('handling page info works', (done) => {
    fixture.detectChanges();

    mockExplorerPageInfoSelector.setResult(MOCK_EXPLORER_PAGE_INFO_1);

    store.refreshState();

    component.pageInfo$.subscribe((pageInfo: ExplorerPageInfo | null) => {
      expect(pageInfo).toEqual(MOCK_EXPLORER_PAGE_INFO_1);
      done();
    });
  });

  describe('previousPage()', () => {
    it('handling previous page request works', () => {
      const paginationChangeSpy = jest.spyOn(component.paginationChange, 'emit');

      fixture.detectChanges();

      mockExplorerPageInfoSelector.setResult(MOCK_EXPLORER_PAGE_INFO_1);

      store.refreshState();

      component.previousPage();

      expect(component.isChangeInProgress).toBeTruthy();
      expect(paginationChangeSpy).toHaveBeenCalledWith({
        itemsKey: ExplorerPaginationItemsKey.Last,
        itemsValue: MOCK_EXPLORER_PAGE_INFO_1.itemsPerPage,
        cursorKey: ExplorerPaginationCursorKey.Before,
        cursorValue: `"${MOCK_EXPLORER_PAGE_INFO_1.cursorStart}"`,
      });
    });

    it('previous page is not emitted when page info is not available', () => {
      const paginationChangeSpy = jest.spyOn(component.paginationChange, 'emit');

      fixture.detectChanges();

      component.previousPage();

      expect(paginationChangeSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('nextPage()', () => {
    it('handling previous page request works', () => {
      const paginationChangeSpy = jest.spyOn(component.paginationChange, 'emit');

      fixture.detectChanges();

      mockExplorerPageInfoSelector.setResult(MOCK_EXPLORER_PAGE_INFO_1);

      store.refreshState();

      component.nextPage();

      expect(component.isChangeInProgress).toBeTruthy();
      expect(paginationChangeSpy).toHaveBeenCalledWith({
        itemsKey: ExplorerPaginationItemsKey.First,
        itemsValue: MOCK_EXPLORER_PAGE_INFO_1.itemsPerPage,
        cursorKey: ExplorerPaginationCursorKey.After,
        cursorValue: `"${MOCK_EXPLORER_PAGE_INFO_1.cursorEnd}"`,
      });
    });

    it('next page is not emitted when page info is not available', () => {
      const paginationChangeSpy = jest.spyOn(component.paginationChange, 'emit');

      fixture.detectChanges();

      component.nextPage();

      expect(paginationChangeSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('onItemsPerPageChanged()', () => {
    it('handling items per page changed request works', () => {
      const paginationChangeSpy = jest.spyOn(component.paginationChange, 'emit');

      fixture.detectChanges();

      mockExplorerPageInfoSelector.setResult(MOCK_EXPLORER_PAGE_INFO_1);

      store.refreshState();

      component.pagination = MOCK_EXPLORER_PAGINATION_1;
      component.onItemsPerPageChanged(10);

      expect(component.isChangeInProgress).toBeTruthy();
      expect(paginationChangeSpy).toHaveBeenCalledWith({
        ...MOCK_EXPLORER_PAGINATION_1,
        itemsValue: 10,
      });
    });

    it('items per page changed is not emitted when page info is not available', () => {
      const paginationChangeSpy = jest.spyOn(component.paginationChange, 'emit');

      fixture.detectChanges();

      component.onItemsPerPageChanged(10);

      expect(paginationChangeSpy).toHaveBeenCalledTimes(0);
    });
  });
});

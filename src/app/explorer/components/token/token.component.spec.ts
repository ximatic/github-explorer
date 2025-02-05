/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, Router } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { MOCK_INITIAL_EXPLORER_STATE, MOCK_TOKEN_1 } from '../../../../__mocks__/explorer.mocks';

import { ExplorerAction } from '../../store/explorer.actions';
import { selectExplorerError, selectExplorerToken } from '../../store/explorer.selectors';

import { TokenComponent } from './token.component';
import { ExplorerError } from '../../store/explorer.errors';

describe('TokenComponent', () => {
  let component: TokenComponent;
  let fixture: ComponentFixture<TokenComponent>;

  let router: Router;
  let store: MockStore;
  let mockExplorerTokenSelector: any;
  let mockExplorerErrorSelector: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApolloTestingModule, TokenComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        provideAnimationsAsync(),
        provideMockStore({ initialState: MOCK_INITIAL_EXPLORER_STATE }),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    mockExplorerTokenSelector = store.overrideSelector(selectExplorerToken, null);
    mockExplorerErrorSelector = store.overrideSelector(selectExplorerError, null);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('handling valid token works', (done) => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    fixture.detectChanges();

    mockExplorerTokenSelector.setResult(MOCK_TOKEN_1);

    store.refreshState();

    component.token$.subscribe((token: string | null) => {
      expect(token).toEqual(MOCK_TOKEN_1);
      expect(component.isSubmitInProgress()).toEqual(false);
      expect(component.isInvalidToken()).toEqual(false);
      expect(navigateSpy).toHaveBeenCalledWith([`/repositories`]);
      done();
    });
  });

  it('handling invalid token works', (done) => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    fixture.detectChanges();

    mockExplorerErrorSelector.setResult(ExplorerError.InvalidToken);

    store.refreshState();

    component.error$.subscribe((error: ExplorerError | null) => {
      expect(error).toEqual(ExplorerError.InvalidToken);
      expect(component.isSubmitInProgress()).toEqual(false);
      expect(component.isInvalidToken()).toEqual(true);
      expect(navigateSpy).toHaveBeenCalledTimes(0);
      done();
    });
  });

  it('handling submit of valid form works', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    component.apiForm.patchValue({ token: MOCK_TOKEN_1 });

    component.submitForm();
    expect(component.isSubmitInProgress()).toEqual(true);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: ExplorerAction.TokenVerify,
      token: MOCK_TOKEN_1,
      storeToken: false,
    });
  });

  it('handling submit of valid form with token storing works', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    component.apiForm.patchValue({ token: MOCK_TOKEN_1, storeToken: true });

    component.submitForm();
    expect(component.isSubmitInProgress()).toEqual(true);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: ExplorerAction.TokenVerify,
      token: MOCK_TOKEN_1,
      storeToken: true,
    });
  });

  it('handling submit of invalid form works', () => {
    fixture.detectChanges();

    expect(component.submitForm()).toBeUndefined();
    expect(component.isSubmitInProgress()).toEqual(false);
  });
});

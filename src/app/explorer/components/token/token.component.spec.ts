/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, Router } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { DEFAULT_INITIAL_EXPLORER_STATE, DEFAULT_TOKEN_1 } from '../../../../__mocks__/explorer.mocks';

import { ExplorerAction } from '../../store/explorer.actions';
import { selectExplorerToken } from '../../store/explorer.selectors';

import { TokenComponent } from './token.component';

describe('TokenComponent', () => {
  let component: TokenComponent;
  let fixture: ComponentFixture<TokenComponent>;

  let router: Router;
  let store: MockStore;
  let mockExplorerTokenSelector: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApolloTestingModule, TokenComponent],
      providers: [
        provideRouter([]),
        provideAnimationsAsync(),
        provideMockStore({ initialState: DEFAULT_INITIAL_EXPLORER_STATE }),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    mockExplorerTokenSelector = store.overrideSelector(selectExplorerToken, null);
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

    mockExplorerTokenSelector.setResult(DEFAULT_TOKEN_1);

    store.refreshState();

    component.token$.subscribe((token: string | null) => {
      expect(token).toEqual(DEFAULT_TOKEN_1);
      expect(component.isSubmitInProgress).toEqual(false);
      expect(component.isInvalidToken).toEqual(false);
      expect(navigateSpy).toHaveBeenCalledWith([`/repositories`]);
      done();
    });
  });

  it('handling invalid token works', (done) => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    fixture.detectChanges();

    mockExplorerTokenSelector.setResult('');

    store.refreshState();

    component.token$.subscribe((token: string | null) => {
      expect(token).toEqual('');
      expect(component.isSubmitInProgress).toEqual(false);
      expect(component.isInvalidToken).toEqual(true);
      expect(navigateSpy).toHaveBeenCalledTimes(0);
      done();
    });
  });

  it('handling submit of valid form works', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    component.apiForm.patchValue({ token: DEFAULT_TOKEN_1 });

    component.submitForm();
    expect(component.isSubmitInProgress).toEqual(true);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: ExplorerAction.TokenVerify,
      token: DEFAULT_TOKEN_1,
    });
  });

  it('handling submit of invalid form works', () => {
    fixture.detectChanges();

    expect(component.submitForm()).toBeUndefined();
    expect(component.isSubmitInProgress).toEqual(false);
  });
});

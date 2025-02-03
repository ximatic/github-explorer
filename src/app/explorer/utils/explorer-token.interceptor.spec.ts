/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { DEFAULT_INITIAL_EXPLORER_STATE, DEFAULT_TOKEN_1 } from '../../../__mocks__/explorer.mocks';

import { selectExplorerToken } from '../store/explorer.selectors';

import { explorerTokenInterceptor } from './explorer-token.interceptor';

import { environment } from '../../../environments/environment';

describe('explorerTokenInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let store: MockStore;

  let mockExplorerTokenSelector: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([explorerTokenInterceptor])),
        provideHttpClientTesting(),
        provideMockStore({ initialState: DEFAULT_INITIAL_EXPLORER_STATE }),
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    store = TestBed.inject(MockStore);

    mockExplorerTokenSelector = store.overrideSelector(selectExplorerToken, null);
  });

  // auth token

  it('adding Token to Authorization header does not work when Token is null', () => {
    mockExplorerTokenSelector.setResult(null);

    store.refreshState();

    const url = `${environment.githubGraphQL}`;
    httpClient.post(url, {}).subscribe();

    const req = httpMock.expectOne(url);
    expect(req.request.headers.get('Authorization')).toBeNull();
  });

  it('adding Token to Authorization header works for supported method (POST)', () => {
    mockExplorerTokenSelector.setResult(DEFAULT_TOKEN_1);

    store.refreshState();

    const url = `${environment.githubGraphQL}`;
    httpClient.post(url, {}).subscribe();

    const req = httpMock.expectOne(url);
    expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${DEFAULT_TOKEN_1}`);
  });

  it('adding Token to Authorization header does not work for not supported method (GET)', () => {
    mockExplorerTokenSelector.setResult(DEFAULT_TOKEN_1);

    store.refreshState();

    const url = `${environment.githubGraphQL}`;
    httpClient.get(url).subscribe();

    const req = httpMock.expectOne(url);
    expect(req.request.headers.get('Authorization')).toBeNull();
  });
});

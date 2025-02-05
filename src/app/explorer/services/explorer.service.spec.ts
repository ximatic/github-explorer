import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { gql } from 'apollo-angular';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';

import {
  MOCK_EXPLORER_PAGINATION_1,
  MOCK_REPOSITORY_NAME_1,
  MOCK_REPOSITORY_OWNER_1,
  MOCK_TOKEN_1,
} from '../../../__mocks__/explorer.mocks';
import {
  MOCK_LOAD_REPOSITORIES_RESPONSE_1,
  MOCK_LOAD_REPOSITORIES_QUERY_1,
  MOCK_LOAD_REPOSITORY_RESPONSE_1,
  MOCK_LOAD_REPOSITORY_QUERY_1,
} from '../../../__mocks__/explorer-graphql.mocks ';

import { RepositoriesResponse, Repository, RepositoryIssue, RepositoryResponse } from '../models/explorer.model';
import { GraphqlRepositoriesNode, GraphqlRepositoryIssue } from '../models/explorer-graphql.schema';

import { environment } from '../../../environments/environment';

import { ExplorerService } from './explorer.service';

describe('ExplorerService', () => {
  let httpMock: HttpTestingController;
  let apolloMock: ApolloTestingController;
  let service: ExplorerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [provideHttpClient(), provideHttpClientTesting(), ExplorerService],
      teardown: { destroyAfterEach: false },
    });

    localStorage.clear();

    httpMock = TestBed.inject(HttpTestingController);
    apolloMock = TestBed.inject(ApolloTestingController);
    service = TestBed.inject(ExplorerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
    apolloMock.verify();
  });

  describe('verifyToken()', () => {
    it('verifying valid token works', fakeAsync(() => {
      const mockData = '';
      const expectedResponse = true;
      let serviceResponse!: boolean;

      service.verifyToken(MOCK_TOKEN_1).subscribe((result: boolean) => {
        serviceResponse = result;
      });

      const req = httpMock.expectOne(`${environment.githubTokenVerification}`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('GET');
      expect(serviceResponse).toEqual(expectedResponse);
    }));

    it('verifying valid token with storing in local storage works', fakeAsync(() => {
      const mockData = '';
      const expectedResponse = true;
      let serviceResponse!: boolean;

      service.verifyToken(MOCK_TOKEN_1, true).subscribe((result: boolean) => {
        serviceResponse = result;
      });

      const req = httpMock.expectOne(`${environment.githubTokenVerification}`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('GET');
      expect(serviceResponse).toEqual(expectedResponse);
      expect(localStorage.getItem('gh-explorer-token')).toEqual(JSON.stringify(MOCK_TOKEN_1));
    }));

    it('verifying invalid token works', fakeAsync(() => {
      const mockData = new ErrorEvent('Invalid Request', {
        error: new HttpErrorResponse({
          error: { code: `Invalid Request`, message: `Invalid Request` },
          status: 400,
          statusText: 'Bad Request',
        }),
      });
      const expectedResponse = false;
      let serviceResponse!: boolean;

      service.verifyToken(MOCK_TOKEN_1).subscribe((result: boolean) => {
        serviceResponse = result;
      });

      const req = httpMock.expectOne(`${environment.githubTokenVerification}`);
      req.error(mockData);

      tick();

      expect(req.request.method).toEqual('GET');
      expect(serviceResponse).toEqual(expectedResponse);
    }));

    it('verifying empty token works', fakeAsync(() => {
      const expectedResponse = false;
      let serviceResponse!: boolean;

      service.verifyToken('').subscribe((result: boolean) => {
        serviceResponse = result;
      });

      httpMock.expectNone(`${environment.githubTokenVerification}`);

      tick();

      expect(serviceResponse).toEqual(expectedResponse);
    }));
  });

  describe('loadRepositories()', () => {
    it('loading repositories works', fakeAsync(() => {
      const mockData = { data: MOCK_LOAD_REPOSITORIES_RESPONSE_1 };
      const expectedResponse = {
        repositories: MOCK_LOAD_REPOSITORIES_RESPONSE_1.search.nodes.map((node: GraphqlRepositoriesNode) => {
          return {
            name: node.name,
            owner: node.owner.login,
            stars: node.stargazerCount,
            createdAt: new Date(node.createdAt),
            description: node.description,
          } as Repository;
        }),
        pageInfo: {
          itemsPerPage: MOCK_EXPLORER_PAGINATION_1.itemsValue,
          cursorStart: MOCK_LOAD_REPOSITORIES_RESPONSE_1.search.pageInfo.startCursor,
          cursorEnd: MOCK_LOAD_REPOSITORIES_RESPONSE_1.search.pageInfo.endCursor,
          hasNextPage: MOCK_LOAD_REPOSITORIES_RESPONSE_1.search.pageInfo.hasNextPage,
          hasPreviousPage: MOCK_LOAD_REPOSITORIES_RESPONSE_1.search.pageInfo.hasPreviousPage,
        },
      } as RepositoriesResponse;
      let serviceResponse!: RepositoriesResponse;

      service.loadRepositories(MOCK_EXPLORER_PAGINATION_1).subscribe((response: RepositoriesResponse) => {
        serviceResponse = response;
      });

      const req = apolloMock.expectOne(gql`
        ${MOCK_LOAD_REPOSITORIES_QUERY_1}
      `);

      req.flush(mockData);

      tick();

      expect(serviceResponse).toEqual(expectedResponse);
    }));
  });

  describe('loadRepository()', () => {
    it('loading repository works', fakeAsync(() => {
      const mockData = { data: MOCK_LOAD_REPOSITORY_RESPONSE_1 };
      const expectedResponse = {
        repository: {
          owner: MOCK_REPOSITORY_OWNER_1,
          name: MOCK_REPOSITORY_NAME_1,
          stars: MOCK_LOAD_REPOSITORY_RESPONSE_1.repository.stargazerCount,
          createdAt: MOCK_LOAD_REPOSITORY_RESPONSE_1.repository.createdAt,
          description: MOCK_LOAD_REPOSITORY_RESPONSE_1.repository.description,
          url: MOCK_LOAD_REPOSITORY_RESPONSE_1.repository.url,
          issues: MOCK_LOAD_REPOSITORY_RESPONSE_1.repository.issues.nodes.map((node: GraphqlRepositoryIssue) => {
            return {
              title: node.title,
              author: node.author.login,
              url: node.url,
              createdAt: new Date(node.createdAt),
            } as RepositoryIssue;
          }),
        } as Repository,
        pageInfo: {
          itemsPerPage: MOCK_EXPLORER_PAGINATION_1.itemsValue,
          cursorStart: MOCK_LOAD_REPOSITORY_RESPONSE_1.repository.issues.pageInfo.startCursor,
          cursorEnd: MOCK_LOAD_REPOSITORY_RESPONSE_1.repository.issues.pageInfo.endCursor,
          hasNextPage: MOCK_LOAD_REPOSITORY_RESPONSE_1.repository.issues.pageInfo.hasNextPage,
          hasPreviousPage: MOCK_LOAD_REPOSITORY_RESPONSE_1.repository.issues.pageInfo.hasPreviousPage,
        },
      } as RepositoryResponse;
      let serviceResponse!: RepositoryResponse;

      service
        .loadRepository(MOCK_REPOSITORY_OWNER_1, MOCK_REPOSITORY_NAME_1, MOCK_EXPLORER_PAGINATION_1)
        .subscribe((response: RepositoryResponse) => {
          serviceResponse = response;
        });

      const req = apolloMock.expectOne(gql`
        ${MOCK_LOAD_REPOSITORY_QUERY_1}
      `);

      req.flush(mockData);

      tick();

      expect(serviceResponse).toEqual(expectedResponse);
    }));
  });

  describe('loadToken()', () => {
    it('loading token works', fakeAsync(() => {
      localStorage.setItem('gh-explorer-token', JSON.stringify(MOCK_TOKEN_1));

      expect(service.loadToken()).toEqual(MOCK_TOKEN_1);
    }));
  });

  describe('resetToken()', () => {
    it('resetting token works', fakeAsync(() => {
      localStorage.setItem('gh-explorer-token', JSON.stringify(MOCK_TOKEN_1));
      service.resetToken();

      expect(service.loadToken()).toEqual('');
    }));
  });
});

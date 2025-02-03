import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { gql } from 'apollo-angular';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';

import {
  DEFAULT_EXPLORER_PAGINATION_1,
  DEFAULT_REPOSITORY_NAME_1,
  DEFAULT_REPOSITORY_OWNER_1,
  DEFAULT_TOKEN_1,
} from '../../../__mocks__/explorer.mocks';
import {
  DEFAULT_LOAD_REPOSITORIES_RESPONSE_1,
  DEFAULT_TOKEN_VERIFY_RESPONSE_1,
  DEFAULT_TOKEN_VERIFY_QUERY_1,
  DEFAULT_LOAD_REPOSITORIES_QUERY_1,
  DEFAULT_LOAD_REPOSITORY_RESPONSE_1,
  DEFAULT_LOAD_REPOSITORY_QUERY_1,
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

      service.verifyToken(DEFAULT_TOKEN_1).subscribe((result: boolean) => {
        serviceResponse = result;
      });

      const req = httpMock.expectOne(`${environment.githubTokenVerification}`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('GET');
      expect(serviceResponse).toEqual(expectedResponse);
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

      service.verifyToken(DEFAULT_TOKEN_1).subscribe((result: boolean) => {
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

  describe('verifyTokenGraphQl()', () => {
    it('verifying valid token works', fakeAsync(() => {
      const mockData = { data: DEFAULT_TOKEN_VERIFY_RESPONSE_1 };
      const expectedResponse = true;
      let serviceResponse!: boolean;

      service.verifyTokenGraphQl(DEFAULT_TOKEN_1).subscribe((response: boolean) => {
        serviceResponse = response;
      });

      const req = apolloMock.expectOne(gql`
        ${DEFAULT_TOKEN_VERIFY_QUERY_1}
      `);

      req.flush(mockData);

      tick();

      expect(serviceResponse).toEqual(expectedResponse);
    }));

    it('verifying invalid token works', fakeAsync(() => {
      const mockData = {};
      const expectedResponse = false;
      let serviceResponse!: boolean;

      service.verifyTokenGraphQl('').subscribe((response: boolean) => {
        serviceResponse = response;
      });

      const req = apolloMock.expectOne(gql`
        ${DEFAULT_TOKEN_VERIFY_QUERY_1}
      `);

      req.flush(mockData);

      tick();

      expect(serviceResponse).toEqual(expectedResponse);
    }));
  });

  describe('loadRepositories()', () => {
    it('loading repositories works', fakeAsync(() => {
      const mockData = { data: DEFAULT_LOAD_REPOSITORIES_RESPONSE_1 };
      const expectedResponse = {
        repositories: DEFAULT_LOAD_REPOSITORIES_RESPONSE_1.search.nodes.map((node: GraphqlRepositoriesNode) => {
          return {
            name: node.name,
            owner: node.owner.login,
            stars: node.stargazerCount,
            createdAt: new Date(node.createdAt),
            description: node.description,
          } as Repository;
        }),
        pageInfo: {
          itemsPerPage: DEFAULT_EXPLORER_PAGINATION_1.itemsValue,
          cursorStart: DEFAULT_LOAD_REPOSITORIES_RESPONSE_1.search.pageInfo.startCursor,
          cursorEnd: DEFAULT_LOAD_REPOSITORIES_RESPONSE_1.search.pageInfo.endCursor,
          hasNextPage: DEFAULT_LOAD_REPOSITORIES_RESPONSE_1.search.pageInfo.hasNextPage,
          hasPreviousPage: DEFAULT_LOAD_REPOSITORIES_RESPONSE_1.search.pageInfo.hasPreviousPage,
        },
      } as RepositoriesResponse;
      let serviceResponse!: RepositoriesResponse;

      service.loadRepositories(DEFAULT_EXPLORER_PAGINATION_1).subscribe((response: RepositoriesResponse) => {
        serviceResponse = response;
      });

      const req = apolloMock.expectOne(gql`
        ${DEFAULT_LOAD_REPOSITORIES_QUERY_1}
      `);

      req.flush(mockData);

      tick();

      expect(serviceResponse).toEqual(expectedResponse);
    }));
  });

  describe('loadRepository()', () => {
    it('loading repository works', fakeAsync(() => {
      const mockData = { data: DEFAULT_LOAD_REPOSITORY_RESPONSE_1 };
      const expectedResponse = {
        repository: {
          owner: DEFAULT_REPOSITORY_OWNER_1,
          name: DEFAULT_REPOSITORY_NAME_1,
          stars: DEFAULT_LOAD_REPOSITORY_RESPONSE_1.repository.stargazerCount,
          createdAt: DEFAULT_LOAD_REPOSITORY_RESPONSE_1.repository.createdAt,
          description: DEFAULT_LOAD_REPOSITORY_RESPONSE_1.repository.description,
          url: DEFAULT_LOAD_REPOSITORY_RESPONSE_1.repository.url,
          issues: DEFAULT_LOAD_REPOSITORY_RESPONSE_1.repository.issues.nodes.map((node: GraphqlRepositoryIssue) => {
            return {
              title: node.title,
              author: node.author.login,
              url: node.url,
              createdAt: new Date(node.createdAt),
            } as RepositoryIssue;
          }),
        } as Repository,
        pageInfo: {
          itemsPerPage: DEFAULT_EXPLORER_PAGINATION_1.itemsValue,
          cursorStart: DEFAULT_LOAD_REPOSITORY_RESPONSE_1.repository.issues.pageInfo.startCursor,
          cursorEnd: DEFAULT_LOAD_REPOSITORY_RESPONSE_1.repository.issues.pageInfo.endCursor,
          hasNextPage: DEFAULT_LOAD_REPOSITORY_RESPONSE_1.repository.issues.pageInfo.hasNextPage,
          hasPreviousPage: DEFAULT_LOAD_REPOSITORY_RESPONSE_1.repository.issues.pageInfo.hasPreviousPage,
        },
      } as RepositoryResponse;
      let serviceResponse!: RepositoryResponse;

      service
        .loadRepository(DEFAULT_REPOSITORY_OWNER_1, DEFAULT_REPOSITORY_NAME_1, DEFAULT_EXPLORER_PAGINATION_1)
        .subscribe((response: RepositoryResponse) => {
          serviceResponse = response;
        });

      const req = apolloMock.expectOne(gql`
        ${DEFAULT_LOAD_REPOSITORY_QUERY_1}
      `);

      req.flush(mockData);

      tick();

      expect(serviceResponse).toEqual(expectedResponse);
    }));
  });
});

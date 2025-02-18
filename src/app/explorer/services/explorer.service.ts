import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, map, Observable, of } from 'rxjs';

import { DEFAULT_EXPLORER_PAGINATION } from '../constants/explorer.const';

import {
  ExplorerPageInfo,
  ExplorerPagination,
  RepositoriesResponse,
  Repository,
  RepositoryIssue,
  RepositoryResponse,
} from '../models/explorer.model';
import {
  GraphqlPageInfo,
  GraphqlRepositoriesData,
  GraphqlRepositoriesNode,
  GraphqlRepositoryData,
  GraphqlRepositoryIssue,
} from '../models/explorer-graphql.schema';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExplorerService {
  private tokenStorageKey = 'gh-explorer-token';

  constructor(
    private httpClient: HttpClient,
    private apollo: Apollo,
  ) {}

  // token verification

  verifyToken(token: string, storeToken?: boolean): Observable<boolean> {
    if (!token) {
      return of(false);
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.httpClient.get(environment.githubTokenVerification, { headers, responseType: 'text' }).pipe(
      map(() => {
        if (storeToken) {
          this.storeToken(token);
        }
        return true;
      }),
      catchError(() => of(false)),
    );
  }

  // github - GraphQL

  loadRepositories(pagination: ExplorerPagination = DEFAULT_EXPLORER_PAGINATION): Observable<RepositoriesResponse> {
    return this.apollo
      .query<GraphqlRepositoriesData>({
        query: gql`
          query {
            search(query: "is:public sort:stars-desc", type: REPOSITORY, ${pagination.itemsKey}: ${pagination.itemsValue}, ${pagination.cursorKey}: ${pagination.cursorValue}) {
              nodes {
                ...repositoryFragment
              }
              pageInfo {
                endCursor
                startCursor
                hasNextPage
                hasPreviousPage
              }
            }
          }
          fragment repositoryFragment on Repository {
            name
            createdAt
            owner {
              login
            }
            description
            stargazerCount
          }
        `,
      })
      .pipe(
        map((result: ApolloQueryResult<GraphqlRepositoriesData>) => {
          const repositories = result.data.search.nodes.map((node: GraphqlRepositoriesNode) => {
            return {
              name: node.name,
              owner: node.owner?.login || 'N/A',
              stars: node.stargazerCount,
              createdAt: new Date(node.createdAt),
              description: node.description,
            } as Repository;
          });

          return {
            repositories,
            pageInfo: this.createPageInfo(pagination.itemsValue, result.data.search.pageInfo),
          } as RepositoriesResponse;
        }),
      );
  }

  loadRepository(
    owner: string,
    name: string,
    pagination: ExplorerPagination = DEFAULT_EXPLORER_PAGINATION,
  ): Observable<RepositoryResponse> {
    return this.apollo
      .query<GraphqlRepositoryData>({
        query: gql`
        query {
          repository(owner: "${owner}", name: "${name}") {
            stargazerCount
            description
            createdAt
            url
            issues(${pagination.itemsKey}: ${pagination.itemsValue}, ${pagination.cursorKey}: ${pagination.cursorValue}, orderBy: { field: CREATED_AT, direction: DESC }) {
                nodes {
                    title,
                    createdAt
                    author {
                        login
                    }
                    url
                }
                pageInfo {
                    endCursor
                    startCursor
                    hasNextPage
                    hasPreviousPage
                }
            }
          }
        }
      `,
      })
      .pipe(
        map((result: ApolloQueryResult<GraphqlRepositoryData>) => {
          const dataRepository = result.data.repository;

          const repository = {
            name,
            owner,
            stars: dataRepository.stargazerCount,
            createdAt: dataRepository.createdAt,
            description: dataRepository.description,
            url: dataRepository.url,
            issues: dataRepository.issues.nodes.map((node: GraphqlRepositoryIssue) => {
              return {
                title: node.title,
                author: node.author?.login || 'N/A',
                url: node.url,
                createdAt: new Date(node.createdAt),
              } as RepositoryIssue;
            }),
          } as Repository;

          return {
            repository,
            pageInfo: this.createPageInfo(pagination.itemsValue, dataRepository.issues.pageInfo),
          } as RepositoryResponse;
        }),
      );
  }

  // token

  loadToken(): string {
    return JSON.parse(localStorage.getItem(this.tokenStorageKey) || '""');
  }

  resetToken(): void {
    localStorage.removeItem(this.tokenStorageKey);
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.tokenStorageKey, JSON.stringify(token));
  }

  // pagination

  private createPageInfo(itemsPerPage: number, pageInfo: GraphqlPageInfo): ExplorerPageInfo {
    return {
      itemsPerPage,
      cursorStart: pageInfo.startCursor,
      cursorEnd: pageInfo.endCursor,
      hasNextPage: pageInfo.hasNextPage,
      hasPreviousPage: pageInfo.hasPreviousPage,
    };
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, map, Observable, of } from 'rxjs';

import {
  defaultExplorerPagination,
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
  GraphqlVerifyData,
} from '../models/explorer-graphql.schema';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExplorerService {
  constructor(
    private httpClient: HttpClient,
    private apollo: Apollo,
  ) {}

  // this is GitHub's recommended way to verify access token
  verifyToken(token: string): Observable<boolean> {
    if (!token) {
      return of(false);
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.httpClient.get(environment.githubTokenVerification, { headers, responseType: 'text' }).pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }

  // as an alternative (to only use GraphQL requests), solution could be used with simple request
  verifyTokenGraphQl(token: string): Observable<boolean> {
    return this.apollo
      .query<GraphqlVerifyData>({
        query: gql`
          query {
            viewer {
              login
            }
          }
        `,
        context: {
          headers: new HttpHeaders({
            authorization: `Bearer ${token}`,
          }),
        },
      })
      .pipe(map((result: ApolloQueryResult<GraphqlVerifyData>) => !!result?.data?.viewer?.login));
  }

  loadRepositories(pagination: ExplorerPagination = defaultExplorerPagination): Observable<RepositoriesResponse> {
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
    pagination: ExplorerPagination = defaultExplorerPagination,
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

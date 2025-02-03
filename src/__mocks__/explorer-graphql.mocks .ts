import {
  GraphqlRepositoriesData,
  GraphqlRepositoryData,
  GraphqlVerifyData,
} from '../app/explorer/models/explorer-graphql.schema';

import { DEFAULT_EXPLORER_PAGINATION_1, DEFAULT_REPOSITORY_NAME_1, DEFAULT_REPOSITORY_OWNER_1 } from './explorer.mocks';

// verify token
export const DEFAULT_TOKEN_VERIFY_QUERY_1 = `
  query {
    viewer {
      login
    }
  }
`;

export const DEFAULT_TOKEN_VERIFY_RESPONSE_1: GraphqlVerifyData = {
  viewer: {
    login: 'test-login-1',
  },
};

// repositories

export const DEFAULT_LOAD_REPOSITORIES_QUERY_1 = `
query {
  search(query: "is:public sort:stars-desc", type: REPOSITORY, ${DEFAULT_EXPLORER_PAGINATION_1.itemsKey}: ${DEFAULT_EXPLORER_PAGINATION_1.itemsValue}, ${DEFAULT_EXPLORER_PAGINATION_1.cursorKey}: ${DEFAULT_EXPLORER_PAGINATION_1.cursorValue}) {
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
`;

export const DEFAULT_LOAD_REPOSITORIES_RESPONSE_1: GraphqlRepositoriesData = {
  search: {
    pageInfo: {
      endCursor: 'Y3Vyc29yOjU=',
      startCursor: 'Y3Vyc29yOjE=',
      hasNextPage: true,
      hasPreviousPage: false,
    },
    nodes: [
      // ApolloTestingController has problems to handle ... on Repository from query so for now code below is commented out
      // {
      //   name: 'freeCodeCamp',
      //   createdAt: '2014-12-24T17:49:19Z',
      //   owner: {
      //     login: 'freeCodeCamp',
      //   },
      //   stargazerCount: 409110,
      //   description: 'freeCodeCamp.org open-source codebase and curriculum. Learn to code for free.',
      // },
    ],
  },
};

// repository

export const DEFAULT_LOAD_REPOSITORY_QUERY_1 = `
query {
  repository(owner: "${DEFAULT_REPOSITORY_OWNER_1}", name: "${DEFAULT_REPOSITORY_NAME_1}") {
    stargazerCount
    description
    createdAt
    url
    issues(${DEFAULT_EXPLORER_PAGINATION_1.itemsKey}: ${DEFAULT_EXPLORER_PAGINATION_1.itemsValue}, ${DEFAULT_EXPLORER_PAGINATION_1.cursorKey}: ${DEFAULT_EXPLORER_PAGINATION_1.cursorValue}, orderBy: { field: CREATED_AT, direction: DESC }) {
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
`;

export const DEFAULT_LOAD_REPOSITORY_RESPONSE_1: GraphqlRepositoryData = {
  repository: {
    stargazerCount: 409108,
    description: "freeCodeCamp.org's open-source codebase and curriculum. Learn to code for free.",
    createdAt: '2014-12-24T17:49:19Z',
    url: 'https://github.com/freeCodeCamp/freeCodeCamp',
    issues: {
      pageInfo: {
        endCursor: 'Y3Vyc29yOnYyOpK5MjAyNS0wMS0yMlQxNTowMjowNyswMTowMM6nKPIz',
        startCursor: 'Y3Vyc29yOnYyOpK5MjAyNS0wMS0yMlQxNzoxMjozNyswMTowMM6nLcpV',
        hasNextPage: true,
        hasPreviousPage: false,
      },
      nodes: [
        {
          title: 'global variable abuse: quiz game',
          createdAt: '2025-01-22T16:12:37Z',
          author: {
            login: 'ilenia-magoni',
          },
          url: 'https://github.com/freeCodeCamp/freeCodeCamp/issues/58303',
        },
      ],
    },
  },
};

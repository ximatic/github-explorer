import { GraphqlRepositoriesData, GraphqlRepositoryData } from '../app/explorer/models/explorer-graphql.schema';

import { MOCK_EXPLORER_PAGINATION_1, MOCK_REPOSITORY_NAME_1, MOCK_REPOSITORY_OWNER_1 } from './explorer.mocks';

// repositories

export const MOCK_LOAD_REPOSITORIES_QUERY_1 = `
query {
  search(query: "is:public sort:stars-desc", type: REPOSITORY, ${MOCK_EXPLORER_PAGINATION_1.itemsKey}: ${MOCK_EXPLORER_PAGINATION_1.itemsValue}, ${MOCK_EXPLORER_PAGINATION_1.cursorKey}: ${MOCK_EXPLORER_PAGINATION_1.cursorValue}) {
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

export const MOCK_LOAD_REPOSITORIES_RESPONSE_1: GraphqlRepositoriesData = {
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

export const MOCK_LOAD_REPOSITORY_QUERY_1 = `
query {
  repository(owner: "${MOCK_REPOSITORY_OWNER_1}", name: "${MOCK_REPOSITORY_NAME_1}") {
    stargazerCount
    description
    createdAt
    url
    issues(${MOCK_EXPLORER_PAGINATION_1.itemsKey}: ${MOCK_EXPLORER_PAGINATION_1.itemsValue}, ${MOCK_EXPLORER_PAGINATION_1.cursorKey}: ${MOCK_EXPLORER_PAGINATION_1.cursorValue}, orderBy: { field: CREATED_AT, direction: DESC }) {
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

export const MOCK_LOAD_REPOSITORY_RESPONSE_1: GraphqlRepositoryData = {
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

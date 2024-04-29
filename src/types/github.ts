export enum GithubErrorType {
  RATE_LIMITED = 'RATE_LIMITED',
  NOT_FOUND = 'NOT_FOUND',
}

export type GithubResponse<T> = {
  message?: string;
  errors?: {
    type: GithubErrorType;
    message?: string;
  }[];
  data: T;
}

export interface IGithubStats {
  user: {
    name: string;
    login: string;
    contributionsCollection: {
      totalCommitContributions: number;
      totalPullRequestReviewContributions: number;
    };
    repositoriesContributedTo: {
      totalCount: number;
    };
    pullRequests: {
      totalCount: number;
    };
    mergedPullRequests: {
      totalCount: number;
    };
    openIssues: {
      totalCount: number;
    };
    closedIssues: {
      totalCount: 10;
    };
    followers: {
      totalCount: number;
    };
    repositoryDiscussions: {
      totalCount: number;
    };
    repositoryDiscussionComments: {
      totalCount: number;
    };
    repositories: {
      totalCount: number;
      nodes: {
        stargazers: {
          totalCount: number;
        }
      }[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
    };
  };
}

export type StatsResponse = GithubResponse<IGithubStats>;

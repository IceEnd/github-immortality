import { AxiosResponse } from 'axios';
import { request } from './request';
import {
  retryer, wrapTextMultiline, MissingParamError, CustomError, ErrorCodes, calculateRank
} from '../common';
import { GRAPHQL_REPOS_QUERY, GRAPHQL_STATS_QUERY } from '../graphql';
import { StatsResponse, IGithubStats, GithubErrorType } from '../types/github';
import { IStats } from '../types/stats';

type Variables = {
  login: string;
  first: number;
  includeMergedPullRequests: boolean;
  includeDiscussions: boolean;
  includeDiscussionsAnswers: boolean;
  after: string | null;
}

/**
 * Fetch stats for a given username.
 *
 * @param {string} username GitHub username.
 */
export const fetchStats = async (username?: string): Promise<IStats> => {
  if (!username) {
    throw new MissingParamError(['username']);
  }

  const stats: IStats = {
    name: '',
    totalPRs: 0,
    totalPRsMerged: 0,
    mergedPRsPercentage: 0,
    totalReviews: 0,
    totalCommits: 0,
    totalIssues: 0,
    totalStars: 0,
    totalDiscussionsStarted: 0,
    totalFollowers: 0,
    totalDiscussionsAnswered: 0,
    contributedTo: 0,
    rank: 0,
  };

  const res = await statsFetcher({
    username,
    includeMergedPullRequests: true,
    includeDiscussions: true,
    includeDiscussionsAnswers: true,
  });

  catchError(res);

  const { user } = res.data.data;
  stats.name = user.name || user.login;

  Object.assign(stats, {
    totalCommits: user.contributionsCollection.totalCommitContributions,
    totalPRs: user.pullRequests.totalCount,
    totalReviews: user.contributionsCollection.totalPullRequestReviewContributions,
    contributedTo: user.repositoriesContributedTo.totalCount,
    totalStars: user.repositories.nodes
      .reduce((prev, curr) => {
        return prev + curr.stargazers.totalCount;
      }, 0),
    totalFollowers: user.followers.totalCount,
    totalIssues: user.openIssues.totalCount + user.closedIssues.totalCount,
  });

  stats.rank = calculateRank({
    allCommits: false,
    commits: stats.totalCommits,
    prs: stats.totalPRs,
    reviews: stats.totalReviews,
    issues: stats.totalIssues,
    stars: stats.totalStars,
    followers: user.followers.totalCount,
  });

  return stats;
};

/**
 * Fetch stats information for a given username.
 */
const statsFetcher = async (params: {
  username: string;
  includeMergedPullRequests: boolean;
  includeDiscussions: boolean;
  includeDiscussionsAnswers: boolean;
}) => {
  const {
    username,
    includeMergedPullRequests = false,
    includeDiscussions = false,
    includeDiscussionsAnswers = false,
  } = params;
  let stats;
  let hasNextPage = true;
  let endCursor = null;

  while (hasNextPage) {
    const variables: Variables = {
      login: username,
      first: 100,
      after: endCursor,
      includeMergedPullRequests,
      includeDiscussions,
      includeDiscussionsAnswers,
    };
    const res = await retryer<Variables, IGithubStats>(fetcher, variables);
    if (res.data.errors) {
      return res;
    }

    // Store stats data.
    const repoNodes = res.data.data.user.repositories.nodes;
    if (stats) {
      stats.data.data.user.repositories.nodes.push(...repoNodes);
    } else {
      stats = res;
    }

    // Disable multi page fetching on public Vercel instance due to rate limits.
    const repoNodesWithStars = repoNodes.filter(
      (node) => node.stargazers.totalCount !== 0,
    );
    hasNextPage =
      process.env.FETCH_MULTI_PAGE_STARS === 'true' &&
      repoNodes.length === repoNodesWithStars.length &&
      res.data.data.user.repositories.pageInfo.hasNextPage;
    endCursor = res.data.data.user.repositories.pageInfo.endCursor;
  }

  return stats as AxiosResponse<StatsResponse>;
};

const fetcher = (variables: Variables, token: string): Promise<AxiosResponse<StatsResponse>> => {
  const query = variables.after ? GRAPHQL_REPOS_QUERY : GRAPHQL_STATS_QUERY;
  return request(
    {
      query,
      variables,
    },
    {
      Authorization: `bearer ${token}`,
    },
  );
};

const catchError = (resp?: AxiosResponse<StatsResponse>): void => {
  if (!resp?.data.errors) {
    return;
  }
  console.error(resp.data.errors);
  if (resp.data.errors[0].type === GithubErrorType.NOT_FOUND) {
    throw new CustomError(
      resp.data.errors[0].message || 'Could not fetch user.',
      ErrorCodes.USER_NOT_FOUND,
    );
  }
  if (resp.data.errors[0].message) {
    throw new CustomError(
      wrapTextMultiline(resp.data.errors[0].message, 90, 1)[0],
      resp.statusText,
    );
  }
  throw new CustomError(
    'Something went wrong while trying to retrieve the stats data using the GraphQL API.',
    ErrorCodes.GRAPHQL_ERROR,
  );
};

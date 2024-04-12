import { request } from './request';
import { MissingParamError } from '../common/error';
import { retryer } from '../common/retries';
import { GRAPHQL_REPOS_QUERY, GRAPHQL_STATS_QUERY } from '../graphql';

type Variables = {
  login: string;
  first: number;
  after: boolean;
  includeMergedPullRequests: boolean;
  includeDiscussions: boolean;
  includeDiscussionsAnswers: boolean;
};

/**
 * Fetch stats for a given username.
 *
 * @param {string} username GitHub username.
 */
export const fetchStats = async (username?: string): Promise<any> => {
  if (!username) {
    throw new MissingParamError(['username']);
  }

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
    const res = await retryer(fetcher, variables);
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
      process.env.FETCH_MULTI_PAGE_STARS === "true" &&
      repoNodes.length === repoNodesWithStars.length &&
      res.data.data.user.repositories.pageInfo.hasNextPage;
    endCursor = res.data.data.user.repositories.pageInfo.endCursor;
  }

  return stats;
};

const fetcher = (variables: Variables, token: string) => {
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

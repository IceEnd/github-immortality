/**
 * Calculates the users rank.
 */
export const calculateRank = (params: {
  allCommits: boolean,
  commits: number,
  prs: number,
  issues: number,
  reviews: number,
  stars: number,
  followers: number,
}): number => {
  const { allCommits, commits, prs, issues, reviews, stars, followers } = params;
  const COMMITS_MEDIAN = allCommits ? 1000 : 250;
  const COMMITS_WEIGHT = 2;
  const PRS_WEIGHT = 3;
  const PRS_MEDIAN = 50;
  const ISSUES_MEDIAN = 25;
  const ISSUES_WEIGHT = 1;
  const REVIEWS_MEDIAN = 2;
  const REVIEWS_WEIGHT = 1;
  const STARS_MEDIAN = 50;
  const STARS_WEIGHT = 4;
  const FOLLOWERS_MEDIAN = 10;
  const FOLLOWERS_WEIGHT = 1;

  const TOTAL_WEIGHT =
    COMMITS_WEIGHT +
    PRS_WEIGHT +
    ISSUES_WEIGHT +
    REVIEWS_WEIGHT +
    STARS_WEIGHT +
    FOLLOWERS_WEIGHT;

  const rank = 1 -
    (COMMITS_WEIGHT * exponentialCdf(commits / COMMITS_MEDIAN) +
      PRS_WEIGHT * exponentialCdf(prs / PRS_MEDIAN) +
      ISSUES_WEIGHT * exponentialCdf(issues / ISSUES_MEDIAN) +
      REVIEWS_WEIGHT * exponentialCdf(reviews / REVIEWS_MEDIAN) +
      STARS_WEIGHT * logNormalCdf(stars / STARS_MEDIAN) +
      FOLLOWERS_WEIGHT * logNormalCdf(followers / FOLLOWERS_MEDIAN)) /
      TOTAL_WEIGHT;

  return rank * 100;
};

const exponentialCdf = (x: number): number => 1 - 2 ** -x;

const logNormalCdf = (x: number): number => x / (1 + x);

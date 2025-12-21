/**
 * 计算用户的修仙等级（基于 GitHub 数据的优化算法）
 * 
 * 权重设计理念：
 * - 声望(Stars): 最高权重，代表作品影响力和认可度
 * - 信众(Followers): 高权重，代表个人影响力和号召力
 * - 助力(PRs): 较高权重，代表对开源社区的实质贡献
 * - Code Reviews: 中等权重，代表帮助他人和代码质量把控能力
 * - 心魔(Issues): 中等权重，代表发现和解决问题的能力
 * - 修为(Commits): 较低权重，代表日常修炼（防止刷数据）
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
  
  // 中位数设置（基于 GitHub 用户数据分析）
  const COMMITS_MEDIAN = allCommits ? 2000 : 500;
  const COMMITS_WEIGHT = 1;
  
  const PRS_MEDIAN = 30;
  const PRS_WEIGHT = 3;
  
  const ISSUES_MEDIAN = 30;
  const ISSUES_WEIGHT = 2;
  
  const REVIEWS_MEDIAN = 10;
  const REVIEWS_WEIGHT = 2;
  
  const STARS_MEDIAN = 100;
  const STARS_WEIGHT = 6;
  
  const FOLLOWERS_MEDIAN = 20;
  const FOLLOWERS_WEIGHT = 4;

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

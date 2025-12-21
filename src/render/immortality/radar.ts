import { IStats } from '../../types/stats';

const MAX_STARTS = 10000;
const MAX_FOLLOWERS = 1000;
const MAX_PRS = 500;
const MAX_CONTRIBUTED = 10;
const MAX_ISSUES = 200;
const MAX_COMMITS = 365;
const RADIAN = Math.PI / 3;

/**
 * 渲染六边形雷达图（修仙属性图）
 * - 修为：每日勤修苦练，吞服灵药积攒的法力真元
 * - 名望：名号在各大坊市、拍卖行被道友们传颂
 * - 因果：每一次向外伸出援手，都与他人结下一份道缘
 * - 心魔：修行路上的魔障，唯有以无上毅力斩之
 * - 信众：被你神通折服，愿追随你感悟大道的道友
 * - 助阵：踏足各方势力，在重大战事/项目中施展手段
 */
export function renderRadar(stats: IStats): string {
  const rx = 60;
  const ry = 60 * Math.sin(Math.PI / 3);
  const polygon60 = renderHexagon(60);
  const polygon40 = renderHexagon(40);
  const polygon20 = renderHexagon(20);

  const star = Math.min(stats.totalStars / MAX_STARTS, 1) * 60;
  const starPoint = [rx - star / 2 , ry - star * Math.sin(RADIAN)];

  const pr = Math.min(stats.totalPRs / MAX_PRS, 1) * 60;
  const prPoint = [rx + pr / 2, ry - pr * Math.sin(RADIAN)];

  const issues = Math.min(stats.totalIssues / MAX_ISSUES, 1) * 60;
  const issuesPoint = [rx + issues, ry];

  const follower = Math.min(stats.totalFollowers / MAX_FOLLOWERS, 1) * 60;
  const followerPoint = [rx + follower / 2, ry + follower * Math.sin(RADIAN)];

  const commits = Math.min(stats.totalCommits / MAX_COMMITS, 1) * 60;
  const commitsPoint = [rx - commits / 2, ry + commits * Math.sin(RADIAN)];

  const contributed = Math.min(stats.contributedTo / MAX_CONTRIBUTED, 1) * 60;
  const contributedPoint = [rx - contributed / 2, ry];

  const radarPoints = `${starPoint[0]},${starPoint[1]} ${prPoint[0]},${prPoint[1]} ${issuesPoint[0]},${issuesPoint[1]} ${followerPoint[0]},${followerPoint[1]} ${commitsPoint[0]},${commitsPoint[1]} ${contributedPoint[0]},${contributedPoint[1]}`;

  const total = calculateDistance(starPoint, prPoint)
                + calculateDistance(prPoint, issuesPoint)
                + calculateDistance(issuesPoint, followerPoint)
                + calculateDistance(followerPoint, commitsPoint)
                + calculateDistance(commitsPoint, contributedPoint)
                + calculateDistance(contributedPoint, starPoint);

  return `
  <defs>
    <radialGradient id="hexGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" style="stop-color:#dbbdbb" stop-opacity="1" />
      <stop offset="100%" style="stop-color:#e8d1cf" stop-opacity="0.3" />
    </radialGradient>
  </defs>
  <g class="hexagon" transform="translate(60, 75)">
    <polygon
      stroke="#cebcba"
      fill="url(#hexGradient)"
      points="${polygon60.map(item => item.join(',')).join(' ')}"
    />
    <polygon
      stroke="#ab8e8a"
      stroke-width="0.5"
      transform="translate(20, ${20 * Math.sin(Math.PI / 3)})"
      points="${polygon40.map(item => item.join(',')).join(' ')}"
    />
    <polygon
      stroke="#ab8e8a"
      stroke-width="0.5"
      transform="translate(40, ${40 * Math.sin(Math.PI / 3)})"
      points="${polygon20.map(item => item.join(',')).join(' ')}"
    />
    ${polygon60.map((item) => `<line x1="${rx}" y1="${ry}" x2="${item[0]}" y2="${item[1]}" stroke="#cebcba" />`).join('')}
    <style>
    .radar {
      stroke-dasharray: ${total} ${total};
      stroke-dashoffset: -${total};
      fill-opacity: 0;
      animation: radar-dash 4.5s ease-in-out forwards;
    }
    @keyframes radar-dash {
      0% {
        stroke-dashoffset: -${total};
        fill-opacity: 0;
      }
      90% {
        stroke-dashoffset: 0;
        fill-opacity: 0;
      }
      100% {
        stroke-dashoffset: 0;
        fill-opacity: .5;
      }
    }
    </style>
    <polygon class="radar" stroke="#7d6f6d" points="${radarPoints}" fill="#fff" />
    <g transform="translate(${polygon60[1][0]}, -18)">
      <text x="0" y="0" class="radar-label text">名望</text>
      <text x="0" y="13" class="radar-value text">${stats.totalStars}</text>
    </g>
    <g transform="translate(${polygon60[2][0]}, -18)">
      <text x="0" y="0" class="radar-label text">因果</text>
      <text x="0" y="13" class="radar-value text">${stats.totalPRs}</text>
    </g>

    <g transform="translate(${polygon60[3][0] + 20}, ${polygon60[3][1]})">
      <text x="0" y="0" class="radar-label text">心魔</text>
      <text x="0" y="13" class="radar-value text">${stats.totalIssues}</text>
    </g>
    <g transform="translate(${polygon60[4][0]}, ${polygon60[4][1] + 14})">
      <text x="0" y="0" class="radar-label text">信众</text>
      <text x="0" y="13" class="radar-value text">${stats.totalFollowers}</text>
    </g>
    <g transform="translate(${polygon60[5][0]}, ${polygon60[5][1] + 14})">
      <text x="0" y="0" class="radar-label text">修为</text>
      <text x="0" y="13" class="radar-value text">${stats.totalCommits}</text>
    </g>
    <g transform="translate(${polygon60[0][0] - 14}, ${polygon60[0][1]})">
      <text x="0" y="0" class="radar-label text">助阵</text>
      <text x="0" y="13" class="radar-value text">${stats.contributedTo}</text>
    </g>
  </g>
  `;
}

/**
 * 渲染六边形的顶点坐标
 */
function renderHexagon(length: number): number[][] {
  const long = length * Math.sin(Math.PI / 3);
  const short = length / 2;
  const x1 = 0;
  const x2 = short;
  const x3 = length + short;
  const x4 = length * 2;
  const y1 = long;
  const y2 = 0;
  const y3 = 2 * long;
  return [
    [x1, y1],
    [x2, y2],
    [x3, y2],
    [x4, y1],
    [x3, y3],
    [x2, y3],
  ];
}

/**
 * 计算两点之间的距离
 */
function calculateDistance(a: number[], b: number[]): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  return Math.sqrt(dx * dx + dy * dy);
}


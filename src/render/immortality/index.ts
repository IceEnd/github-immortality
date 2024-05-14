import { Render } from '../base';
import { BRUSH, PEOPLE, PEOPLE_TEXTURE } from '../../assets';
import { IStats } from '../../types/stats';

const MAX_STARTS = 10000;
const MAX_FOLLOWERS = 1000;
const MAX_PRS = 500;
const MAX_CONTRIBUTED = 10;
const MAX_ISSUES = 200;
const MAX_COMMITS = 365;
const RADIAN = Math.PI / 3;

export class ImmortalityRender extends Render {
  constructor(stats: IStats) {
    super(stats);
  }

  public renderContent(): string {
    return `
      ${this.renderTitle()}
      ${this.renderRadarChart()}
      ${this.renderLevel()}
    `;
  }

  private renderLevel(): string {
    const THRESHOLDS = [1, 5, 10, 15, 20, 30,40,50,60, 70, 80, 90, 100];
    const LEVELS = ['道祖', '大罗', '太乙', '金仙', '真仙', '大乘', '合体', '炼虚', '化神', '元婴', '金丹', '筑基', '练气'];
    const level = LEVELS[THRESHOLDS.findIndex((t) => this.stats.rank <= t)];

    return `
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="${100 - this.stats.rank}%" stop-color="#fff" stop-opacity="0.3">
            <animate attributeName="offset" values="0;${1 - (this.stats.rank / 100)};" dur="2s" repeatCount="1"/>
          </stop>
          <stop offset="${this.stats.rank}%" stop-color="transparent" stop-opacity="0" />
        </linearGradient>
      </defs>
      <symbol id="peopleBorder">${PEOPLE}</symbol>
      <g transform="translate(330, 65) scale(1.4)" class="hexagon" style="animation-delay: 250ms">
        <g fill="#4d4947" fill-opacity="0.9">
          <use href="#peopleBorder" />
        </g>
        <g fill="#6e828d">${PEOPLE_TEXTURE}</g>
        <g fill="url(#progressGradient)">
          <use href="#peopleBorder" />
        </g>
        <g class="fade-in" style="animation-delay: 2s">
          <circle cx="35" cy="50" r="20" fill="#6baecf" fill-opacity="0.75">
            <animate attributeName="r" values="19;20;19" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="35" cy="50" r="16" fill="none" stroke="#7d6f6d" stroke-dasharray="10 10">
            <animate attributeName="r" values="16;17;16" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text class="level" font-weight="800" fill="#f4eca7" writing-mode="tb" letter-spacing="1" style="font-size: 12px;" y="50" x="35" text-anchor="middle">${level}</text>
        </g>
      </g>
    `;
  }

  public renderHead(): string {
    return `${this.renderStyle()}`;
  }

  private renderStyle(): string {
    return `
      <title>${this.stats.name}的仙途</title>
      <style>
      .title {
        opacity: 0;
        font-weight: 800;
        animation: fadeIn .5s ease-in-out forwards;
      }
      .hexagon, .fade-in {
        opacity: 0;
        animation: fadeIn .5s ease-in-out forwards;
      }
      .text {
        font-family: 'Segoe UI', Ubuntu, Sans-Serif;
      }
      .level {
        font-family: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      }
      .title {
        font-size: 14px;
        fill: #fff;
      }
      .radar-label {
        font-size: 11px;
        fill: #1d1d14;
        text-anchor: middle;
      }
      .radar-value {
        font-size: 11px;
        fill: #5a8747;
        text-anchor: middle;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      </style>
    `;
  }

  private renderTitle(): string {
    return `
      <defs>
        <linearGradient id="titleGradient">
          <stop offset="0%" stop-color="#f4eca7">
            <animate attributeName="stop-color" values="#f4eca7; #d6a534; #f4eca7" dur="5s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
        <filter id="titleGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <g class="title">
        <g transform="translate(165, 8)">
          ${BRUSH}
        </g>
        <text class="text" x="50%" y="26" text-anchor="middle" fill="url(#titleGradient)" filter="url(#titleGlow)">
          ${this.stats.name}
        </text>
      </g>
    `;
  }

  private renderRadarChart(): string {
    const rx = 60;
    const ry = 60 * Math.sin(Math.PI / 3);
    const polygon60 = this.renderHexagon(60);
    const polygon40 = this.renderHexagon(40);
    const polygon20 = this.renderHexagon(20);

    const star = Math.min(this.stats.totalStars / MAX_STARTS, 1) * 60;
    const starPoint = [rx - star / 2 , ry - star * Math.sin(RADIAN)];

    const pr = Math.min(this.stats.totalPRs / MAX_PRS, 1) * 60;
    const prPoint = [rx + pr / 2, ry - pr * Math.sin(RADIAN)];

    const issues = Math.min(this.stats.totalIssues / MAX_ISSUES, 1) * 60;
    const issuesPoint = [rx + issues, ry];

    const follower = Math.min(this.stats.totalFollowers / MAX_FOLLOWERS, 1) * 60;
    const followerPoint = [rx + follower / 2, ry + follower * Math.sin(RADIAN)];

    const commits = Math.min(this.stats.totalCommits / MAX_COMMITS, 1) * 60;
    const commitsPoint = [rx - commits / 2, ry + commits * Math.sin(RADIAN)];

    const contributed = Math.min(this.stats.contributedTo / MAX_CONTRIBUTED, 1) * 60;
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
        <text x="0" y="0" class="radar-label text">Star</text>
        <text x="0" y="13" class="radar-value text">${this.stats.totalStars}</text>
      </g>
      <g transform="translate(${polygon60[2][0]}, -18)">
        <text x="0" y="0" class="radar-label text">PRs</text>
        <text x="0" y="13" class="radar-value text">${this.stats.totalPRs}</text>
      </g>

      <g transform="translate(${polygon60[3][0] + 20}, ${polygon60[3][1]})">
        <text x="0" y="0" class="radar-label text">Issues</text>
        <text x="0" y="13" class="radar-value text">${this.stats.totalIssues}</text>
      </g>
      <g transform="translate(${polygon60[4][0]}, ${polygon60[4][1] + 14})">
        <text x="0" y="0" class="radar-label text">Followers</text>
        <text x="0" y="13" class="radar-value text">${this.stats.totalFollowers}</text>
      </g>
      <g transform="translate(${polygon60[5][0]}, ${polygon60[5][1] + 14})">
        <text x="0" y="0" class="radar-label text">Commits</text>
        <text x="0" y="13" class="radar-value text">${this.stats.totalCommits}</text>
      </g>
      <g transform="translate(${polygon60[0][0] - 14}, ${polygon60[0][1]})">
        <text x="0" y="0" class="radar-label text">C2</text>
        <text x="0" y="13" class="radar-value text">${this.stats.contributedTo}</text>
      </g>
    </g>
    `;
  }

  private renderHexagon(length: number): number[][] {
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
}

/**
 * calculates the distance between two points
 */
const calculateDistance = (a: number[], b: number[]): number => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  return Math.sqrt(dx * dx + dy * dy);
};

import { Render } from '../base';
import { BRUSH } from '../../assets';
import { IStats } from '../../../src/types/stats';

export class ImmortalityRender extends Render {
  constructor(stats: IStats) {
    super(stats);
  }

  public renderContent(): string {
    return `
      ${this.renderTitle()}
    `;
  }

  public renderHead(): string {
    return `${this.renderStyle()}`;
  }

  public renderStyle(): string {
    return `
      <style>
      .title {
        opacity: 0;
        font-weight: 800;
        animation: fadeIn .5s ease-in-out forwards;
      }
      .text {
        font-family: 'Segoe UI', Ubuntu, Sans-Serif;
      }
      .title {
        font-size: 14px;
        fill: #fff;
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

  public renderTitle(): string {
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
}

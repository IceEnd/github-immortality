import { renderBackground } from './background';
import { renderName } from './name';
import { renderRadar } from './radar';
import { renderLevel } from './level';
import { Render } from '../base';
import { IStats } from '../../types/stats';
import { renderStamp } from './stamp';
import { renderTopLanguages } from './top-languages';

export class ImmortalityRender extends Render {
  constructor(stats: IStats) {
    super(stats);
  }

  public renderContent(): string {
    return `
      ${this.renderTitle()}
      ${this.renderRadarChart()}
      ${this.renderTopLanguages()}
      ${renderLevel(this.stats.rank)}
      ${this.renderStamp()}
    `;
  }

  public renderHead(): string {
    return `${this.renderStyle()}`;
  }

  public renderBackground(): string {
    return renderBackground({
      width: Render.WIDTH,
      height: Render.HEIGHT,
      radius: Render.CARD_RADIUS,
    });
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
    return renderName({
      name: this.stats.name,
      render: {
        width: Render.WIDTH,
        height: Render.HEIGHT,
        radius: Render.CARD_RADIUS,
      },
    });
  }

  private renderRadarChart(): string {
    return renderRadar(this.stats);
  }

  private renderStamp(): string {
    return renderStamp({
      width: Render.WIDTH,
      height: Render.HEIGHT,
      radius: Render.CARD_RADIUS,
    });
  }

  private renderTopLanguages(): string {
    return renderTopLanguages({
      width: Render.WIDTH,
      height: Render.HEIGHT,
      radius: Render.CARD_RADIUS,
    }, this.stats.topLanguages);
  }
}

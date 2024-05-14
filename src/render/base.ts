import { MOUNTAIN } from '../assets';
import { IStats } from '../types/stats';

export class Render {
  static WIDTH = 500;
  static HEIGHT = 220;
  static CARD_RADIUS = 8;

  protected stats: IStats;

  constructor(stats: IStats) {
    this.stats = stats;
  }

  public render(): string {
    const template = `<svg xmlns="http://www.w3.org/2000/svg" width="${Render.WIDTH}" height="${Render.HEIGHT}" viewBox="0 0 ${Render.WIDTH} ${Render.HEIGHT}" role="img" fill="none">
      ${this.renderHead()}
      ${this.renderBackground()}
      ${this.renderContent()}
    </svg>`;
    return template.replace(/>\s+</g, '><').replace(/\n|\r/g, '').trim();
  }

  public renderContent(): string {
    return '';
  }

  public renderHead(): string {
    return '';
  }

  private renderBackground(): string {
    return `
    <g stroke="none" fill="#f2f0eb">
      <rect width="${Render.WIDTH}" height="${Render.HEIGHT}" rx="${Render.CARD_RADIUS}" />
    </g>
    ${MOUNTAIN}
    `;
  }
}

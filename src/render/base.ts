import { IStats } from '../types/stats';

export class Render {
  static WIDTH = 500;
  static HEIGHT = 220;
  static CARD_RADIUS = 8;

  protected stats: IStats;
  protected theme: 'light' | 'dark';

  constructor(stats: IStats, theme: 'light' | 'dark' = 'light') {
    this.stats = stats;
    this.theme = theme;
  }

  public render(): string {
    const isDark = this.theme === 'dark';
    const darkFilterDef = isDark ? `
      <filter id="dark-theme-filter" color-interpolation-filters="sRGB">
        <feColorMatrix type="matrix" values="-1 0 0 0 1   0 -1 0 0 1   0 0 -1 0 1   0 0 0 1 0" />
        <feColorMatrix type="hueRotate" values="180" />
        <feComponentTransfer><feFuncR type="linear" slope="0.9" /><feFuncG type="linear" slope="0.9" /><feFuncB type="linear" slope="0.9" /></feComponentTransfer>
        <feComponentTransfer><feFuncR type="linear" slope="1.2" intercept="-0.1" /><feFuncG type="linear" slope="1.2" intercept="-0.1" /><feFuncB type="linear" slope="1.2" intercept="-0.1" /></feComponentTransfer>
      </filter>
    ` : '';
    
    const contentStart = isDark ? '<g filter="url(#dark-theme-filter)">' : '';
    const contentEnd = isDark ? '</g>' : '';

    const template = `<svg xmlns="http://www.w3.org/2000/svg" width="${Render.WIDTH}" height="${Render.HEIGHT}" viewBox="0 0 ${Render.WIDTH} ${Render.HEIGHT}" role="img" fill="none">
      <defs>${darkFilterDef}</defs>
      ${this.renderHead()}
      ${contentStart}
      ${this.renderBackground()}
      ${this.renderContent()}
      ${contentEnd}
    </svg>`;
    return template.replace(/>\s+</g, '><').replace(/\n|\r/g, '').trim();
  }

  public renderContent(): string {
    return '';
  }

  public renderHead(): string {
    return '';
  }

  public renderBackground(): string {
    return '';
  }
}

import { FOG_SHIM, FOG_SHIM_REVERSE } from '../assets';
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
    <defs>
      <filter id="fogFill" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000" flood-opacity="0.3" />
        <feGaussianBlur stdDeviation="8" />
      </filter>
      <filter id="fogShadow">
        <feGaussianBlur result="gaussian_blur_7_12" stdDeviation="4"/>
      </filter>
      <linearGradient id="flogShadowFill" x1="0" y1="0" x2="0" y2="100%" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#000" stop-opacity="0.2" />
        <stop offset="1" stop-color="#ccc" stop-opacity="0.2" />
      </linearGradient>
    </defs>
    <g stroke="none" fill="#f2f0eb">
      <rect width="${Render.WIDTH}" height="${Render.HEIGHT}" rx="${Render.CARD_RADIUS}" />
    </g>
    <symbol id="Fog">${FOG_SHIM}</symbol>
    <symbol id="FogReverse">${FOG_SHIM_REVERSE}</symbol>
    <g opacity="0.6" tansform="translate(0, 0)">
      <use href="#Fog" transform="scale(1.5) rotate(8)" x="40" y="10" />
      <use href="#FogReverse" transform="scale(0.8, 1.5) rotate(-8)" x="-80" y="40" />
      <use href="#Fog" transform="scale(1.1) rotate(8)" x="100" y="-20" />
      <use href="#FogReverse" transform="scale(1.1, 1.2) rotate(-8)" x="-80" y="-20" />
      <use href="#Fog" transform="scale(1.3, 0.5) rotate(10)" x="50" y="-50" />
      <use href="#FogReverse" transform="scale(0.8)" x="-20" y="-40" />
    </g>
    <g>
      <use href="#Fog" transform="rotate(8)" />
      <animateTransform
        attributeName="transform"
        type="translate"
        values="500 -20; -400 40;"
        dur="30s"
        repeatCount="indefinite"
      />
    </g>

    <g>
      <use href="#FogReverse" transform="rotate(-8)" />
      <animateTransform
        attributeName="transform"
        type="translate"
        values="-400 40; 500 20;"
        dur="36s"
        repeatCount="indefinite"
      />
    </g>
    `;
  }
  // <!-- ${MOUNTAIN} -->
}

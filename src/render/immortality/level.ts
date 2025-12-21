import path from 'path';
import { renderSvgFragment } from '../../assets';

const PEOPLE = renderSvgFragment(path.resolve(__dirname, '../../assets/immortality/light/people.svg'));
const PEOPLE_TEXTURE = renderSvgFragment(path.resolve(__dirname, '../../assets/immortality/light/people-texture.svg'));

// 加载等级素材（1-13级）
const LEVEL_SVGS = Array.from({ length: 13 }, (_, i) => 
  renderSvgFragment(path.resolve(__dirname, `../../assets/immortality/light/level/${i + 1}.svg`))
);

const LEVEL_COLORS = [
  '#C5A059', // 道祖 - 古铜金
  '#8E7AA3', // 大罗 - 暮色紫
  '#6D7E8D', // 太乙 - 玄水蓝
  '#B08968', // 金仙 - 琥珀色
  '#BDC3C7', // 真仙 - 玄玉白
  '#7D6B7D', // 大乘 - 幽冥紫
  '#5E6D7D', // 合体 - 星辰蓝
  '#8D8D8D', // 炼虚 - 虚无灰
  '#7BA8A1', // 化神 - 灵泉青
  '#A38E9F', // 元婴 - 灵蕴粉
  '#A69076', // 金丹 - 金砂色
  '#7D8D77', // 筑基 - 苍松绿
  '#6D645E', // 练气 - 尘世褐
];

export const renderLevel = (rank: number): string => {
  const THRESHOLDS = [1, 5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const levelIndex = THRESHOLDS.findIndex((t) => rank <= t);
  const levelColor = LEVEL_COLORS[levelIndex] || '#4d4947';

  return `
    <defs>
      <linearGradient id="progressGradient" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="${100 - rank}%" stop-color="#fff" stop-opacity="0.3">
          <animate attributeName="offset" values="0;${1 - (rank / 100)};" dur="2s" repeatCount="1"/>
        </stop>
        <stop offset="${rank}%" stop-color="transparent" stop-opacity="0" />
      </linearGradient>
      ${renderWaterRippleFilter()}
    </defs>
    <symbol id="peopleBorder">${PEOPLE}</symbol>
    <g transform="translate(330, 65) scale(1.4)" class="hexagon" style="animation-delay: 250ms">
      <g>
        <g fill="#4d4947" fill-opacity="0.9" >
          <use href="#peopleBorder" />
        </g>
        <g fill="${levelColor}">${PEOPLE_TEXTURE}</g>
        <g fill="url(#progressGradient)">
          <use href="#peopleBorder" />
        </g>
      </g>
      ${renderLevelBadge(levelIndex)}
    </g>
  `;
};

/**
 * 渲染等级徽章
 */
const renderLevelBadge = (levelIndex: number): string => {
  const svgIndex = LEVEL_SVGS.length - 1 - levelIndex;
  const levelSvg = LEVEL_SVGS[svgIndex] || '';
  return `
    <g class="fade-in" style="animation-delay: 2s" filter="url(#waterRipple)">
      <g transform="translate(23, 30) scale(0.45)" fill="#010001" stroke="#010001" stroke-width="1">
        ${levelSvg}
      </g>
    </g>
  `;
};

/**
 * 渲染水波荡漾滤镜效果
 */
const renderWaterRippleFilter = (): string => {
  return `
    <filter id="waterRipple" x="-50%" y="-50%" width="200%" height="200%">
      <feTurbulence
        type="turbulence" 
        baseFrequency="0.02" 
        numOctaves="2" 
        result="turbulence">
        <animate
          attributeName="baseFrequency" 
          values="0.02;0.03;0.02"
          dur="4s"
          repeatCount="indefinite"/>
      </feTurbulence>
      <feDisplacementMap
        in="SourceGraphic"
        in2="turbulence"
        scale="3"
        xChannelSelector="R"
        yChannelSelector="G">
        <animate
          attributeName="scale"
          values="3;5;3"
          dur="4s"
          repeatCount="indefinite"/>
      </feDisplacementMap>
    </filter>
  `;
};

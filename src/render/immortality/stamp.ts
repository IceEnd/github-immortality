import path from 'path';
import { renderSvgFragment } from '../../assets';
import { IRender } from '../../types/render';

export const renderStamp = (render: IRender): string => {
  return `
    <g transform="translate(${render.width - 40}, ${render.height - 60}) scale(0.45)">
      ${renderSvgFragment(path.resolve(__dirname, '../../assets/immortality/light/stamp.svg'))}
    </g>
  `;
};
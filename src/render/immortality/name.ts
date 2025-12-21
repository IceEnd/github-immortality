import path from 'path';
import { IRender } from '../../types/render';
import { renderSvgFragment } from '../../assets';

export const renderName = (props: {
  name: string;
  render: IRender;
}): string => {
  const { name, render } = props;

  return `
    <g class="title">
    <g transform="scale(0.7, 0.5) translate(${render.width / 2 - 10}, 8)">
        ${renderSvgFragment(path.resolve(__dirname, '../../assets/immortality/light/brush.svg'))}
    </g>
    <text class="text" x="50%" y="30" text-anchor="middle" fill="#fff" >
        ${name}
    </text>
    </g>
`;
};


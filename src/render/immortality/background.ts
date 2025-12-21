import { IRender } from '../../types/render';
import { renderSvgFragment } from '../../assets';
import path from 'path';

export const renderBackground = (render: IRender): string => {
  return `
    ${renderBackgroundGradient(render)}
    ${renderClouds(render)}
  `;
};

/**
 * Render the background gradient
 */
const renderBackgroundGradient = (render: IRender): string => {
  return `
    <defs>
      <linearGradient id="backgroundGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(172, 204, 197, 1)" />
        <stop offset="50%" stop-color="rgba(203, 217, 208, 1)" />
        <stop offset="100%" stop-color="rgba(236, 231, 220, 1)" />
      </linearGradient>
    </defs>
    <g>
      <rect width="${render.width}" height="${render.height}" rx="${render.radius}" fill="url(#backgroundGradient)" />
    </g>
  `;
};

/**
 * Render the clouds
 */
const renderClouds = (render: IRender): string => {
  let cloudSymbol = '';
  for (let i = 0; i < 4; i++) {
    cloudSymbol += `
      <symbol id="e-cloud-${i + 1}">
        ${renderSvgFragment(path.resolve(__dirname, `../../assets/immortality/light/cloud-${i + 1}.svg`))}
      </symbol>
    `;
  }
  return `
    ${cloudSymbol}
    <g class="clouds-group-1" opacity="0.8">
      <use href="#e-cloud-1" />
      <animateTransform
        attributeName="transform"
        type="translate"
        from="-100 ${render.height - 54}"
        to="${render.width + 10} ${render.height - 54}"
        dur="240s"
        begin="-4s"
        repeatCount="indefinite"
      />
    </g>
    <g class="clouds-group-2">
      <g>
        <use href="#e-cloud-2" transform="translate(-80, 25)" />
        <use href="#e-cloud-4" />
        <use href="#e-cloud-4" transform="translate(45, 18)" />
      </g>
      <animateTransform
        attributeName="transform"
        type="translate"
        from="-160 ${render.height - 54}"
        to="${render.width + 10} ${render.height - 54}"
        dur="240s"
        begin="-120s"
        repeatCount="indefinite"
      />
    </g>
    <g class="clouds-group-3" opacity="0.5" >
      <use href="#e-cloud-2" />
      <animateTransform
        attributeName="transform"
        type="translate"
        from="-170 ${render.height - 120}"
        to="${render.width + 10} ${render.height - 120}"
        dur="400s"
        begin="-180s"
        repeatCount="indefinite"
      />
    </g>
    <g class="clouds-group-4" opacity="0.3">
      <use href="#e-cloud-3" />
      <animateTransform
        attributeName="transform"
        type="translate"
        from="-150 -10"
        to="${render.width + 10} -10"
        dur="180s"
        begin="-120s"
        repeatCount="indefinite"
      />
    </g>

    <g class="clouds-group-5" opacity="0.25" >
      <use href="#e-cloud-3" transform="translate(-80, -10)" />
      <use href="#e-cloud-1" transform="translate(-150, 0)" />
      <use href="#e-cloud-2" transform="translate(-80, 25)" />
      <use href="#e-cloud-3" />

      <animateTransform
        attributeName="transform"
        type="translate"
        from="100 0"
        to="${render.width + 100} -10"
        dur="180000s"
        begin="-0s"
        repeatCount="indefinite"
      />
    </g>
  `;
};

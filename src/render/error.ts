/**
 * Renders error message on the card.
 *
 * @param {string} message Main error message.
 * @param {string} secondaryMessage The secondary error message.
 * @returns {string} The SVG markup.
 */
export const renderError = (message: string, secondaryMessage?: string): string => `
<svg width="576"  height="120" viewBox="0 0 576 120" fill="#fff" xmlns="http://www.w3.org/2000/svg">
<style>
.text { font: 600 16px 'Segoe UI', Ubuntu, Sans-Serif; fill: #000 }
.small { font: 600 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: #000 }
.gray { fill: #858585 }
</style>
<rect x="0.5" y="0.5" width="${
  575
}" height="99%" rx="4.5" fill="#fff" stroke="#000"/>
<text x="25" y="45" class="text">Something went wrong!</text>
<text data-testid="message" x="25" y="55" class="text small">
  <tspan x="25" dy="18">${message}</tspan>
  <tspan x="25" dy="18" class="gray">${secondaryMessage || ''}</tspan>
</text>
</svg>
`;

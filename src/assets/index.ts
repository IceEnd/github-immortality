import fs from 'fs';

export const renderSvgFragment = (svgPath: string): string => {
  return fs.readFileSync(svgPath, 'utf-8');
};

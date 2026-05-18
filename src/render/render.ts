import { ImmortalityRender } from './immortality';
import { Render } from './base';
import { IStats } from '../types/stats';

export const renderStatsCard = (stats: IStats, theme: 'light' | 'dark' = 'light') => {
  const instance = getInstance(stats, theme);

  return instance.render();
};

const getInstance = (stats: IStats, theme: 'light' | 'dark'): Render => {
  const instance = new ImmortalityRender(stats, theme);

  return instance;
};



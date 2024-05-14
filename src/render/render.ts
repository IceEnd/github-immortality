import { ImmortalityRender } from './immortality';
import { Render } from './base';
import { IStats } from '../types/stats';

export const renderStatsCard = (stats: IStats) => {
  const instance = getInstance(stats);

  return instance.render();
};

const getInstance = (stats: IStats): Render => {
  const instance = new ImmortalityRender(stats);

  return instance;
};



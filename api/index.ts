import { VercelRequest, VercelResponse } from '@vercel/node';
import { renderError, renderStatsCard } from './render';
import { fetchStats } from './fetchers/stats';
import { CustomError } from './common/error';
import { RequestQuery } from '../src/types/request';

export const main = async (request: VercelRequest, response: VercelResponse) => {
  const { username } = request.query as RequestQuery;
  response.setHeader('Content-Type', 'image/svg+xml');

  try {
    const stats = await fetchStats(username);
    response.status(200);
    response.send(renderStatsCard(stats));
  } catch (error) {
    const { message, secondaryMessage } = error as CustomError;
    return response.send(
      renderError(message, secondaryMessage)
    );
  }
};

export default main;

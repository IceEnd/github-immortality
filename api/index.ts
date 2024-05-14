import { VercelRequest, VercelResponse } from '@vercel/node';
import { renderError, renderStatsCard } from '../src/render';
import { fetchStats } from '../src/fetchers/stats';
import { CustomError } from '../src/common/error';
import { RequestQuery } from '../src/types/request';

const main = async (request: VercelRequest, response: VercelResponse) => {
  const { username } = request.query as RequestQuery;
  response.setHeader('Content-Type', 'image/svg+xml');

  try {
    const stats = await fetchStats(username);
    response.status(200);
    response.setHeader('Cache-Control', 'max-age=10800');
    response.send(renderStatsCard(stats));
  } catch (error) {
    const { message, secondaryMessage } = error as CustomError;
    return response.send(
      renderError(message, secondaryMessage)
    );
  }
};

export default main;

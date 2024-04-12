import { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchStats } from './fetchers/stats';
import { renderError } from './render/error';
import { CustomError } from './common/error';
import { RequestQuery } from '../src/types/request';

export const main = async (request: VercelRequest, response: VercelResponse) => {
  const { username } = request.query as RequestQuery;
  try {
    const stats = await fetchStats(username);
  } catch (error) {
    const { message, secondaryMessage } = error as CustomError;
    return response.send(
      renderError(message, secondaryMessage)
    );
  }
  response.status(200).send(`Hello, ${username}!`);
};

export default main;

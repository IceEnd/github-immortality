import axios, { AxiosResponse } from 'axios';
import { GithubResponse } from '../../src/types/github';

export const request = <T>(data: Record<string, unknown>, headers: Record<string, string>): Promise<AxiosResponse<GithubResponse<T>>> => {
  return axios({
    url: 'https://api.github.com/graphql',
    method: 'post',
    headers,
    data,
  });
};

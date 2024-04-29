import { AxiosResponse } from 'axios';
import { CustomError, ErrorCodes } from './error';
import { GithubResponse, GithubErrorType } from '../../src/types/github';

const PATs = Object.keys(process.env).filter((key) =>
  /GITHUB_PAT_\d*$/.exec(key),
).length;

const RETRIES = process.env.NODE_ENV === 'test' ? 1 : PATs;

export const retryer = async <T, R>(
  fetcher: (variables: T, token: string) => Promise<AxiosResponse<GithubResponse<R>>>,
  variables: T,
  retries = 0,
): Promise<AxiosResponse<GithubResponse<R>>> => {
  if (!RETRIES) {
    throw new CustomError('No GitHub API tokens found', ErrorCodes.NO_TOKENS);
  }
  if (retries > RETRIES) {
    throw new CustomError(
      'Downtime due to GitHub API rate limiting',
      ErrorCodes.MAX_RETRY,
    );
  }
  try {
    const token = process.env[`GITHUB_PAT_${retries + 1}`] as string;
    const response = await fetcher(
      variables,
      token,
    );
    const isRateExceeded = response.data.errors?.[0].type === GithubErrorType.RATE_LIMITED;
    if (isRateExceeded) {
      console.log(`PAT_${retries + 1} Failed`);
      return retryer(fetcher, variables, ++retries);
    }
    return response;
  } catch (error) {
    const { response } = (error as { response?: AxiosResponse<GithubResponse<R>> });
    const isBadCredential = response?.data?.message === 'Bad credentials';
    const isAccountSuspended = response?.data?.message === 'Sorry. Your account was suspended.';
    if (isBadCredential || isAccountSuspended) {
      console.log(`GITHUB_PAT_${retries + 1} Failed`);
      // directly return from the function
      return retryer(fetcher, variables, ++retries);
    } else {
      return response as AxiosResponse<GithubResponse<R>>;
    }
  }
};

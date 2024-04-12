/**
 * Base Error
*/
export class CustomError extends Error {
  secondaryMessage?: string;
  /**
   * Base error constructor.
   *
   * @param {string} message Error message.
   */
  constructor(message: string, secondaryMessage?: string) {
    super(message);
    this.secondaryMessage = secondaryMessage;
  }
}

/**
 * Missing query parameter class.
 */
export class MissingParamError extends CustomError {
  missedParams: unknown;
  /**
   * Missing query parameter error constructor.
   *
   * @param {string[]} missedParams An array of missing parameters names.
   */
  constructor(missedParams: string[]) {
    const msg = `Missing params ${missedParams
      .map((p) => `"${p}"`)
      .join(', ')} make sure you pass the parameters in URL`;
    super(msg);
    this.missedParams = missedParams;
  }
}

export enum ErrorCodes {
  MAX_RETRY = 'You can deploy own instance or wait until public will be no longer limited',
  NO_TOKENS = 'Please add an env variable called GITHUB_PAT_1 with your GitHub API token in vercel',
}


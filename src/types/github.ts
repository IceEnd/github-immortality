export enum GithubErrorType {
  RATE_LIMITED = 'RATE_LIMITED',
}

export type GithubResponse<T> = {
  message?: string;
  errors?: {
    type: GithubErrorType,
  }[];
  data: T;
}

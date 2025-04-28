export interface OAuthClient {
  app: string;
  authorized: boolean;
  provider: string;
  tools: string[] | null;
}

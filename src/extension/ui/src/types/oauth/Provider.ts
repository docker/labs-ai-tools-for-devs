export interface OAuthProvider {
  app: string;
  authorized: boolean;
  provider: string;
  tools: string[] | null;
}

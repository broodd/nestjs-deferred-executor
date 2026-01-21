/**
 * Type of application operating modes, defined as: poduction, development, test
 * @example production
 */
export enum ConfigMode {
  'production' = 'production',
  'development' = 'development',
  'test' = 'test',
}

/**
 * [description]
 */
export interface IConfigService {
  getDest(key: string, filename?: string): string;
  getDest(key: string, filename?: string): string;
  get<T = NodeJS.ProcessEnv>(key: string): T;
}

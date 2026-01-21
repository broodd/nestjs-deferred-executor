import fs from 'fs';

import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';

import { ConfigMode } from './interfaces/config.interface';

/**
 * Configuration service
 */
@Injectable()
export class ConfigService {
  /**
   * Prefix
   */
  private readonly envFilePostfix = '_FILE';

  /**
   * Configuration service constructor
   * DotEnv config
   */
  constructor() {
    const { error } = config({ path: `.env.${process.env.NODE_ENV}` });
    if (error) throw error;
  }

  /**
   * Method for checking application operating modes
   * @param  mode The mode to be checked must be enum modes in ConfigMode
   * @return     Returns the boolean value
   */
  public getMode(mode: ConfigMode): boolean {
    return process.env['NODE_ENV'] === mode;
  }

  /**
   * Method for getting the value of a variable in the environment
   * @param  key The key in the environment variable object must be a string
   * @return     Returns the generated type limited the function types JSON.parse()
   */
  public get<T = NodeJS.ProcessEnv>(key: string): T {
    let variable: string | undefined | null = process.env[key];
    if (!variable) {
      const path: string = process.env[key + this.envFilePostfix]!;
      variable = fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : null;
    }
    if (!variable) throw TypeError(`The ${key} cannot be undefined`);
    try {
      return JSON.parse(variable);
    } catch {
      return <T>(<unknown>variable);
    }
  }
}

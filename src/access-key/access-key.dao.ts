/* eslint-disable @typescript-eslint/no-unused-vars */
import AccessKey from '../utils/interface/access-key.interface';
import logger from '../utils/logger';
import { Postgres } from '../utils/postgres/postgresUtil';
import {
  ACCESS_KEY_STATUS,
  serviceConstants,
} from '../constants/service-constants';

export class AccessKeyDao {
  // setting dataBaseName for the dao class
  private dataBaseName: string = serviceConstants.DATABASE;

  // setting tableName for the dao class
  private tableName: string = serviceConstants.ACCESS_KEY_TABLE;

  // setting property for creating connection
  postgres: any;

  constructor() {
    // creating postgres client
    this.postgres = new Postgres();
  }

  async create(accessKeyPayload: AccessKey): Promise<AccessKey> {
    return this.createAccessInPostgres(accessKeyPayload);
  }

  async update(accessKeyPayload: AccessKey): Promise<AccessKey> {
    return this.updateAccessInPostgres(accessKeyPayload);
  }

  async get(params: any): Promise<AccessKey> {
    return this.getAccessFromPostgres(params.accessKey);
  }

  async getAll(params: any): Promise<{ count: number; accessKeys: any[] }> {
    return this.getAllAccessFromPostgres(params);
  }

  async delete(params: any): Promise<boolean> {
    return this.deleteAccessFromPostgres(params.accessKey);
  }

  private async createAccessInPostgres(
    accessKeyPayload: AccessKey,
  ): Promise<AccessKey> {
    let data: any;
    logger.info(
      `Inside createAccessInPostgres is ${JSON.stringify(accessKeyPayload)}`,
    );
    const sqlQuery: string = `INSERT INTO ${this.tableName}(
       "accessKey","userId","adminId",
        "rateLimit","expirationTime",
        "createdAt", "updatedAt",
        "status") values($1,$2,$3,$4,$5,$6,$7,$8)`;

    // initializing connection with the database
    await this.postgres.connect(this.dataBaseName);

    // Trying to execute postgres query
    try {
      data = await this.postgres.execute(sqlQuery, [
        accessKeyPayload.accessKey,
        accessKeyPayload.userId,
        accessKeyPayload.adminId,
        accessKeyPayload.rateLimit,
        accessKeyPayload.expirationTime,
        accessKeyPayload.createdAt,
        accessKeyPayload.updatedAt,
        accessKeyPayload.status,
      ]);
      logger.info(`Access Key creation dao operation is successful`);
    } catch (error) {
      logger.error(`Getting error while inserting access key ${error}`);
      throw new Error(`Getting error while inserting access key ${error}`);
    }

    return accessKeyPayload;
  }

  private async updateAccessInPostgres(
    accessKeyPayload: AccessKey,
  ): Promise<AccessKey> {
    logger.info(
      `INSIDE updateAccessInPostgres METHOD ${JSON.stringify(accessKeyPayload)}`,
    );

    let data: any;
    // Preparing sql update query
    const sqlQuery: string = `UPDATE ${this.tableName} 
        SET  
            "rateLimit" = $1,
            "expirationTime" = $2,
            "updatedAt" = $3,
            "status" = $4
        WHERE "accessKey" = $5`;

    // initializing connection with the database
    await this.postgres.connect(this.dataBaseName);

    // Trying to execute postgres query
    try {
      data = await this.postgres.execute(sqlQuery, [
        accessKeyPayload.rateLimit,
        accessKeyPayload.expirationTime,
        accessKeyPayload.updatedAt,
        accessKeyPayload.status,
        accessKeyPayload.accessKey,
      ]);
      logger.info(`Access key Updation dao operation is successful`);
    } catch (error) {
      logger.error(`Getting error while updation Access key ${error}`);
      throw new Error(`Getting error while updation Access key ${error}`);
    }

    return accessKeyPayload;
  }

  private async getAccessFromPostgres(accessKey: string): Promise<AccessKey> {
    logger.info(`Inside getAccessFromPostgres with ${accessKey}`);
    let data: any;
    // Preparing sql update query
    const sqlQuery: string = `SELECT * FROM ${this.tableName} where "accessKey" = $1`;

    // initializing connection with the database
    await this.postgres.connect(this.dataBaseName);

    // Trying to execute postgres query
    try {
      data = await this.postgres.execute(sqlQuery, [accessKey]);
      logger.info(`accessKey Fetch by Id dao operation is successful`);
    } catch (error) {
      logger.error(`Getting error while fetching accessKey ${error}`);
      throw new Error(`Getting error while fetching accessKey ${error}`);
    }

    return data;
  }

  private async getAllAccessFromPostgres(
    params: any,
  ): Promise<{ count: number; accessKeys: any[] }> {
    logger.info(
      `Inside getAllAccessFromPostgres with ${JSON.stringify(params)}`,
    );

    let data: any;

    // enabling pagination
    const offset: number = params.offset || 0;
    const limit: number = params.limit || 5;

    // default result object
    const result: { count: number; accessKeys: any[] } = {
      count: 0,
      accessKeys: [],
    };

    let sqlQueryParams: Array<string> = [];
    // Preparing sql update query
    let sqlQuery: string = `SELECT count("accessKey") over(), * FROM ${this.tableName}`;
    if (params.status === ACCESS_KEY_STATUS.DISABLED) {
      sqlQueryParams = [params.status];
      sqlQuery += ` where status = $1`;
    }
    sqlQuery += ` offset ${offset} limit ${limit}`;

    logger.info(`sql is ${sqlQuery}`);

    // initializing connection with the database
    await this.postgres.connect(this.dataBaseName);

    // Trying to execute postgres query
    try {
      data = await this.postgres.execute(sqlQuery, sqlQueryParams);
      logger.info(`accessKey Fetch by Id dao operation is successful`);
    } catch (error) {
      logger.error(`Getting error while fetching accessKey ${error}`);
      throw new Error(`Getting error while fetching accessKey ${error}`);
    }

    logger.info(`data is ${JSON.stringify(data)}`);

    if (Array.isArray(data) && data.length > 0) {
      result.count = data[0].count;
      result.accessKeys = data;
    }

    return result;
  }

  private async deleteAccessFromPostgres(accessKey: string): Promise<boolean> {
    let data: any;
    // Preparing sql update query
    const sqlQuery: string = `DELETE FROM ${this.tableName} where "accessKey" = $1`;

    // initializing connection with the database
    await this.postgres.connect(this.dataBaseName);

    // Trying to execute postgres query
    try {
      data = await this.postgres.execute(sqlQuery, [accessKey]);
      logger.info(`accessKey Deletion by Id dao operation is successful`);
    } catch (error) {
      logger.error(`Getting error while deletion accessKey ${error}`);
      throw new Error(`Getting error while deletion accessKey ${error}`);
    }

    return true;
  }
}

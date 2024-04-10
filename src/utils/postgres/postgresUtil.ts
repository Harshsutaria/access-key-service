import { Client } from 'pg';
import postgresConnectionParams from './connectionParams';
import logger from '../logger';
import PostgresConnectionParamsInterface from '../interface/postgres-connection.interface';
import ValidationResultInterface from '../interface/validation-result.interface';

export class Postgres {
  // Ref doc used to implement postgres class
  refDoc: string = `https://node-postgres.com/`;

  // private property to hold pg client object
  // used for creating connection with the postgres database
  // used by the service classes to execute postgres queries
  private pgClient: any;

  constructor() {}

  /**
   * Setting database in connection params based on the use case.
   * @param {string} dataBaseName
   * @returns {PostgresConnectionParamsInterface} connection params
   */
  private setConnectionParams(
    dataBaseName: string,
  ): PostgresConnectionParamsInterface {
    postgresConnectionParams.database = dataBaseName;
    return postgresConnectionParams;
  }

  /**
   * Validating Sql Query options
   * @param {string} query
   * @returns {ValidationResultInterface} validation result
   */
  private validateExecuteParams(query: string): ValidationResultInterface {
    const validationResult = {
      status: true,
      message: 'Validation Successful',
    };

    if (!query) {
      validationResult.status = false;
      validationResult.message = 'Query String Is Mandatory';
      return validationResult;
    }

    return validationResult;
  }

  async connect(dataBaseName: string): Promise<any> {
    console.log(`INSIDE CREATING CONNECTION WITH THE DATABASE METHOD`);

    // adding validation
    if (!dataBaseName) {
      logger.error(`DATABASE NAME IS MANDATORY FOR SETTING UP CONNECTION`);
      throw new Error(`DATABASE NAME IS MANDATORY FOR SETTING UP CONNECTION`);
    }

    // setting connection params
    const connectionParams = this.setConnectionParams(dataBaseName);
    // setting connection params
    this.pgClient = new Client(connectionParams);

    // trying to create client connection
    try {
      await this.pgClient.connect();
      logger.info(`CLIENT CONNECTION CREATED SUCCESSFULLY`);
    } catch (error) {
      logger.error(`getting error while creating postgres connection ${error}`);
      throw new Error(
        `getting error while creating postgres connection ${error}`,
      );
    }

    return this.pgClient;
  }

  /**
   * Method implemented to execute postgres queries
   * @param {string} query // sql query to be executed
   * @param values
   * @returns result
   */
  async execute(query: string, values: Array<string>): Promise<Array<any>> {
    // Adding validation
    const validationResult: ValidationResultInterface =
      this.validateExecuteParams(query);
    if (!validationResult.status) {
      throw new Error(validationResult.message);
    }
    // setting query params for postgres
    const queryParams = {
      text: query,
      values: values || [],
    };
    let result: any;

    // Trying to execute the postgres query
    try {
      result = await this.pgClient.query(queryParams);
      logger.info(`POSTGRES QUERY EXECUTED SUCCESSFULLY`);
    } catch (error) {
      logger.error(`Getting error while executing postgres query ${error}`);
    }

    // returning postgres query result
    if (Array.isArray(result?.rows) && result.rows.length) {
      return result.rows;
    }

    // returning default result
    return [];
  }
}

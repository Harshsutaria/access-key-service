import * as dotenv from 'dotenv';
import PostgresConnectionParamsInterface from '../interface/postgres-connection.interface';

// configuring .env file
dotenv.config();

/**
 * Please shoot an email to harshsutaria25@gmail.com for the env file.
 */
const postgresConnectionParams: PostgresConnectionParamsInterface = {
  host: process.env.HOST,
  port: 5432,
  database: 'commondb_6r7i',
  user: process.env.POSTGRES_USER_NAME,
  password: process.env.POSTGRES_USER_PASSWORD,
  ssl: true,
};

export default postgresConnectionParams;

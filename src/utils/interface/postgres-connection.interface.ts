export default interface PostgresConnectionParamsInterface {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean;
}

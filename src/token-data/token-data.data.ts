import { Postgres } from '../utils/postgres/postgresUtil';
import { serviceConstants } from '../constants/service-constants';

export class TokenDataDao {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get(params: any): object {
    return this.getTokenData();
  }

  private getTokenData(): object {
    return {
      userName: 'mike_ross',
      role: 'ADMIN',
      userId: 'user_221',
      createdAt: new Date().toISOString(),
    };
  }
}

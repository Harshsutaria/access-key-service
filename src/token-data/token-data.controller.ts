import {
  Controller,
  BadRequestException,
  Request,
  InternalServerErrorException,
  Get,
} from '@nestjs/common';
import logger from 'src/utils/logger';
import { HTTPConst } from 'src/constants/service-constants';
import { TokenDataService } from './token-data.service';

@Controller('token-data')
export class TokenDataController {
  // created the class attribute to access token data service layer
  private tokenDataService: any;

  constructor() {
    this.tokenDataService = new TokenDataService();
  }

  @Get()
  async getTokenDataController(@Request() req: Request) {
    logger.info(`inside getTokenDataController with`);
    const { author, params } = this.getServiceArgs(req);

    // Interacting with service layer to update access key information.
    try {
      const result = await this.tokenDataService.getTokenData(author, params);
      return {
        code: HTTPConst.success.OK,
        message: 'Token data fetched successfully',
        result,
      };
    } catch (error: any) {
      logger.info(`error is ${error}`);
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Private method to extract author,params,payload form the request object
   * @param req
   * @returns object
   */
  private getServiceArgs(req: any): any {
    // extracting author object from the req headers
    const author: object = req.headers;

    // Ref:- https://expressjs.com/en/api.html#req.params
    // extracting path/query params from the request object
    const params = {
      ...req.query,
      ...req.params,
    };

    // extracting payload form the req object
    const body: object = req.body || [];

    return {
      author,
      params,
      body,
    };
  }
}

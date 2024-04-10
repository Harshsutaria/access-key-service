import {
  Controller,
  BadRequestException,
  Post,
  Request,
  InternalServerErrorException,
  Put,
  UnauthorizedException,
  Get,
  Delete,
} from '@nestjs/common';
import logger from 'src/utils/logger';
import { AccessKeyService } from './access-key.service';
import { HTTPConst, USER_ROLE } from 'src/constants/service-constants';

@Controller('access-key')
export class AccessKeyController {
  private accessKeyService: any;
  constructor() {
    this.accessKeyService = new AccessKeyService();
  }

  @Post()
  async createAccessKeyController(@Request() req: Request) {
    logger.info(`inside createAccessKeyController with`);
    const { author, params, body } = this.getServiceArgs(req);

    logger.info(`author is ${JSON.stringify(author)}`);
    // validating the authorized user
    if (author['role'] !== USER_ROLE.admin) {
      throw new UnauthorizedException();
    }

    // Interacting with service layer to create access key
    try {
      const result = await this.accessKeyService.createAccessKeyService(
        author,
        params,
        body,
      );
      return {
        code: HTTPConst.success.CREATED,
        message: 'Access Key Created Successfully!!!!',
        result,
      };
    } catch (error: any) {
      logger.info(`error is ${JSON.stringify(error)}`);
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error);
      }
      throw new InternalServerErrorException(error);
    }
  }

  @Put(':accessKey')
  async updateAccessKeyController(@Request() req: Request) {
    logger.info(`inside updateAccessKeyController with`);
    const { author, params, body } = this.getServiceArgs(req);
    logger.info(`author is ${JSON.stringify(author)}`);

    // Interacting with service layer to update access key information.
    try {
      const result = await this.accessKeyService.updateAccessKeyService(
        author,
        params,
        body,
      );
      return {
        code: HTTPConst.success.ACCEPTED,
        message: 'Access Key Updated Successfully!!!!',
        result,
      };
    } catch (error: any) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get(':accessKey')
  async getAccessKeyController(@Request() req: Request) {
    logger.info(`inside getAccessKeyController with`);
    const { author, params } = this.getServiceArgs(req);

    // Interacting with service layer to update access key information.
    try {
      const result = await this.accessKeyService.getAccessKeyByIdService(
        author,
        params,
      );
      return {
        code: HTTPConst.success.OK,
        message: 'Fetched Access key data successfully',
        result,
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error);
      }
      throw new InternalServerErrorException(error);
    }
  }

  @Delete(':accessKey')
  async deleteAccessKeyController(@Request() req: Request) {
    logger.info(`inside deleteAccessKeyController with`);
    const { author, params } = this.getServiceArgs(req);

    // validating the authorized user
    if (author['role'] !== USER_ROLE.admin) {
      throw new UnauthorizedException();
    }

    // Interacting with service layer to create access key
    try {
      const result = await this.accessKeyService.deleteAccessKeyByIdService(
        author,
        params,
      );
      return {
        code: HTTPConst.success.OK,
        message: 'Access Key Deleted Successfully!!!!',
        result,
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error);
      }
      throw new InternalServerErrorException(error);
    }
  }

  @Get()
  async getAllAccessKeyController(@Request() req: Request) {
    logger.info(`inside getAllAccessKeyController with`);
    const { author, params } = this.getServiceArgs(req);

    // validating the authorized user
    if (author['role'] !== USER_ROLE.admin) {
      throw new UnauthorizedException();
    }

    // Interacting with service layer to update access key information.
    try {
      const result = await this.accessKeyService.getAllAccessKeyByIdService(
        author,
        params,
      );
      return {
        code: HTTPConst.success.OK,
        message: 'Fetched Access key data successfully',
        result,
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error);
      }
      throw new InternalServerErrorException(error);
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

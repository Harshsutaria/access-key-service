import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenDataDao } from './token-data.data';
import logger from 'src/utils/logger';
import ValidationResult from 'src/utils/interface/validation-result.interface';
import { tokenParamsValidator } from './token-data.validator';
import AccessKey from 'src/utils/interface/access-key.interface';
import { AccessKeyDao } from 'src/access-key/access-key.dao';
import { ACCESS_KEY_STATUS } from 'src/constants/service-constants';

@Injectable()
export class TokenDataService {
  // private attribute defined to access the dao layer
  // For performing db layer operations.
  private tokenDataDao: any;

  // private attribute defined to access the dao layer for access keys
  // For performing db layer operations.
  private accessKeyDao: any;

  constructor() {
    this.accessKeyDao = new AccessKeyDao();
    this.tokenDataDao = new TokenDataDao();
  }

  async getTokenData(author, params) {
    logger.info(
      `Inside getTokenData with ${JSON.stringify({ author, params })}`,
    );

    // validating input query params
    const validateRequestParams: ValidationResult =
      tokenParamsValidator(params);
    if (!validateRequestParams.status) {
      throw new BadRequestException(validateRequestParams.message);
    }

    // validate if the key exists in the database / belongs to that user.
    const accessKey: AccessKey = await this.accessKeyDao.get(params);
    if (accessKey.userId !== params.userId) {
      throw new UnauthorizedException(
        'User is not authorized to use this access key',
      );
    }

    // user cannot use the access key if the key is disables
    if (
      [ACCESS_KEY_STATUS.DISABLED, ACCESS_KEY_STATUS.EXPIRED].includes(
        accessKey.status,
      )
    ) {
      throw new Error(
        'Access key is disabled we cannot use the same to access token data',
      );
    }

    // validating the access key with respect to rate limit
    if (Number(accessKey.rateLimit) - 1 < 0) {
      throw new Error(
        'Rate limit exceeded for the access key. Please try after some time',
      );
    }

    // checking for access key expiration
    if (accessKey.expirationTime < new Date().toISOString()) {
      // updating the access key status to expired
      await this.accessKeyDao.update({
        ...accessKey,
        status: ACCESS_KEY_STATUS.EXPIRED,
      });
      throw new Error('Access key is expired please contact admin');
    }

    // Interacting with dao layer to fetch the token data
    const tokenData: any = this.tokenDataDao.get();

    // updating the rate limit for the access key
    await this.accessKeyDao.update({
      ...accessKey,
      rateLimit: String(Number(accessKey.rateLimit) - 1),
    });

    // returning the token data
    return tokenData;
  }
}

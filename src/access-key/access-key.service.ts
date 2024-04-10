import { BadRequestException, Injectable } from '@nestjs/common';
import ValidationResult from 'src/utils/interface/validation-result.interface';
import logger from 'src/utils/logger';
import { accessKeyValidator } from './access-key.validator';
import { v4 as uuidv4 } from 'uuid';
import AccessKey from 'src/utils/interface/access-key.interface';
import { ACCESS_KEY_STATUS } from 'src/constants/service-constants';
import { AccessKeyDao } from './access-key.dao';

@Injectable()
export class AccessKeyService {
  // private attribute defined to access the dao layer
  // For performing db layer operations.
  private accessKeyDao: any;

  constructor() {
    this.accessKeyDao = new AccessKeyDao();
  }

  /**
   * Service layer for create access key.
   * @param author
   * @param params
   * @param body
   * @returns
   */
  async createAccessKeyService(author, params, body) {
    logger.info(`inside createAccessKeyService with ${JSON.stringify(body)}`);

    // validating the request payload
    const validateRequestPayload: ValidationResult = accessKeyValidator(body);
    if (!validateRequestPayload.status) {
      throw new BadRequestException(
        `Access key payload is invalid.${validateRequestPayload.message}`,
      );
    }

    logger.info(`calling the service layer`);
    // Creating request payload
    const accessKeyPayload: AccessKey = this.createAccessKeyPayload(body);

    // interacting with dao layer to persist access key
    const accessKey = await this.accessKeyDao.create(accessKeyPayload);

    // returning the access key information to the client
    return accessKey;
  }

  /**
   * Service layer for create access key.
   * @param author
   * @param params
   * @param body
   * @returns
   */
  async updateAccessKeyService(author, params, body) {
    logger.info(`inside updateAccessKeyService with ${JSON.stringify(body)}`);

    // Creating request payload
    const accessKeyPayload: AccessKey = this.updateAccessKeyPayload(body);

    // interacting with dao layer to persist access key
    const accessKey = await this.accessKeyDao.update(accessKeyPayload);

    // returning the access key information to the client
    return accessKey;
  }

  /**
   * Method to create access key request payload.
   * @param payload
   * @returns
   */
  private createAccessKeyPayload(payload: any): AccessKey {
    return {
      accessKey: uuidv4(),
      status: ACCESS_KEY_STATUS.ENABLED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payload,
    };
  }

  /**
   * Method to update access key request payload.
   * @param payload
   * @returns
   */
  private updateAccessKeyPayload(payload: any): AccessKey {
    return {
      updatedAt: new Date().toISOString(),
      ...payload,
    };
  }
}

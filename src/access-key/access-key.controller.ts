import { Controller, Post, Request } from '@nestjs/common';
import logger from 'src/utils/logger';

@Controller('access-key')
export class AccessKeyController {
  @Post()
  createAccessKeyController(@Request() req: Request) {
    logger.info(
      `request is 
      ${JSON.stringify({ headers: req.headers, body: req.body })}`,
    );
  }
}

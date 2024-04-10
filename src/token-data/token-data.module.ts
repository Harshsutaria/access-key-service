import { Module } from '@nestjs/common';
import { TokenDataController } from './token-data.controller';
import { TokenDataService } from './token-data.service';

@Module({
  controllers: [TokenDataController],
  providers: [TokenDataService],
})
export class TokenDataModule {}

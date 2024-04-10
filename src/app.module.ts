import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessKeyModule } from './access-key/access-key.module';
import { TokenDataModule } from './token-data/token-data.module';

@Module({
  imports: [AccessKeyModule, TokenDataModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

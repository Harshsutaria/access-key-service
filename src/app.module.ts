import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessKeyModule } from './access-key/access-key.module';

@Module({
  imports: [AccessKeyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

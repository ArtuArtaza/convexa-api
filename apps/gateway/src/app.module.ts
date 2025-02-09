import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from 'apps/auth/src/auth.module';
import { BusinessModule } from 'apps/business/src/business.module';

@Module({
  imports: [AuthModule, BusinessModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { PrismaService } from 'apps/libs/common/src/service/prisma.service';

@Module({
  imports: [],
  controllers: [BusinessController],
  providers: [BusinessService, PrismaService],
})
export class BusinessModule {}

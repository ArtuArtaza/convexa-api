import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BusinessService } from './business.service';
import {
  PaginationDto,
  paginationSchema,
} from 'apps/gateway/src/dto/pagination.dto';
import { ZodValidationPipe } from 'apps/libs/common/src/pipes/zod-validation.pipe';

@Controller()
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @MessagePattern({ cmd: 'get_users' })
  getUsers(
    @Payload(new ZodValidationPipe(paginationSchema))
    paginationDto: PaginationDto,
  ) {
    return this.businessService.findAll(paginationDto);
  }
}

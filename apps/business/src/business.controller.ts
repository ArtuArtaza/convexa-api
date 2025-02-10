import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BusinessService } from './business.service';
import { PaginationDto } from 'apps/gateway/src/dto/pagination.dto';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

@Controller()
@UsePipes(ZodValidationPipe)
export class BusinessController {
  constructor(private readonly businessService: BusinessService) { }

  @MessagePattern({ cmd: 'get_users' })
  getUsers(
    @Payload()
    paginationDto: PaginationDto,
  ) {
    return this.businessService.findAll(paginationDto);
  }
}

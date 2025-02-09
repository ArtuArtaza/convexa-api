import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from './dto/auth.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'apps/libs/common/src/guards/jwt-auth.guard';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'apps/gateway/src/dto/pagination.dto';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

@ApiTags('/auth')
@Controller()
@UsePipes(ZodValidationPipe)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('BUSINESS_SERVICE') private businessClient: ClientProxy,
  ) {}

  @Post('register')
  @ApiBody({
    type: CreateUserDto,
  })
  register(
    @Body()
    createUserDto: CreateUserDto,
  ) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiBody({
    type: LoginDto,
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all users' })
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'limit' })
  async getUsers(@Query() paginationDto: PaginationDto) {
    return firstValueFrom(
      this.businessClient.send({ cmd: 'get_users' }, paginationDto),
    );
  }
}

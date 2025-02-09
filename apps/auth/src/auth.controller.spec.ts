import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto, LoginDto } from './dto/auth.dto';
import { PaginationDto } from 'apps/gateway/src/dto/pagination.dto';
import { of, throwError } from 'rxjs';
import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let businessClient: ClientProxy;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  const mockBusinessClient = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: 'BUSINESS_SERVICE',
          useValue: mockBusinessClient,
        },
        JwtService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    businessClient = module.get<ClientProxy>('BUSINESS_SERVICE');

    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: CreateUserDto = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    it('should successfully register a user', async () => {
      const mockResponse = {
        message: 'User registered successfully',
        userId: faker.string.uuid(),
      };

      mockAuthService.register.mockResolvedValue(mockResponse);

      const result = await controller.register(registerDto);

      expect(result).toEqual({
        message: expect.any(String),
        userId: expect.any(String),
      });
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should handle registration errors', async () => {
      mockAuthService.register.mockRejectedValue(
        new Error('Registration failed'),
      );

      await expect(controller.register(registerDto)).rejects.toThrow(
        'Registration failed',
      );
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    it('should successfully login a user', async () => {
      const mockToken = { token: faker.string.uuid() };
      mockAuthService.login.mockResolvedValue(mockToken);

      const result = await controller.login(loginDto);

      expect(result).toEqual({
        token: expect.any(String),
      });
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should handle login errors', async () => {
      mockAuthService.login.mockRejectedValue(new Error('Login failed'));

      await expect(controller.login(loginDto)).rejects.toThrow('Login failed');
    });
  });

  describe('getUsers', () => {
    const paginationDto: PaginationDto = {
      page: 1,
      limit: 10,
    };

    const mockPaginatedResponse = {
      users: [
        {
          id: faker.string.uuid(),
          email: faker.internet.email(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      total: 1,
      page: 1,
      totalPages: 1,
    };

    it('should successfully retrieve users', async () => {
      mockBusinessClient.send.mockReturnValue(of(mockPaginatedResponse));

      const result = await controller.getUsers(paginationDto);

      expect(result).toEqual(
        expect.objectContaining({
          users: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              email: expect.any(String),
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
            }),
          ]),
          total: expect.any(Number),
          page: expect.any(Number),
          totalPages: expect.any(Number),
        }),
      );

      expect(businessClient.send).toHaveBeenCalledWith(
        { cmd: 'get_users' },
        paginationDto,
      );
    });

    it('should handle business service errors', async () => {
      mockBusinessClient.send.mockReturnValue(
        throwError(() => new Error('Business service error')),
      );

      await expect(controller.getUsers(paginationDto)).rejects.toThrow(
        'Business service error',
      );
    });
  });
});

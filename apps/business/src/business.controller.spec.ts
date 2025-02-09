import { Test, TestingModule } from '@nestjs/testing';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { faker } from '@faker-js/faker/.';

const mockBusinessService = {
  findAll: jest.fn(),
};

describe('BusinessController', () => {
  let controller: BusinessController;
  let service: BusinessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessController],
      providers: [
        {
          provide: BusinessService,
          useValue: mockBusinessService,
        },
      ],
    }).compile();

    controller = module.get<BusinessController>(BusinessController);
    service = module.get<BusinessService>(BusinessService);
  });

  describe('getUsers', () => {
    const paginationDto = {
      page: 1,
      limit: 10,
      search: 'test',
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

    it('should return users', async () => {
      mockBusinessService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.getUsers(paginationDto);

      expect(result).toBe(mockPaginatedResponse);
      expect(service.findAll).toHaveBeenCalledWith(paginationDto);
    });
  });
});

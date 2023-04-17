import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesService } from './coffees.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Flavor } from './entities/flavor.entity/flavor.entity';
import { Coffee } from './coffee.entity';
import { DataSource, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
});
//返回Repository的mock对象
describe('CoffeesService', () => {
  let service: CoffeesService;
  let coffeeRepository: MockRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        //CoffeesService类依赖于许多其他与数据库相关的provide(Coffee、Flavor、Event)例如连接或者Entity Repositories需要在TestingModele中注册
        //否则会出现Nest无法解析依赖项错误
        CoffeesService,
        {
          provide: getRepositoryToken(Coffee),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Flavor),
          useValue: {},
        },
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    coffeeRepository = module.get<MockRepository>(getRepositoryToken(Coffee));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //使用方法对其命名，并用易懂的语言进行描述
  describe('findOne', () => {
    describe('when coffee with ID exists', () => {
      it('should return the coffee object', async () => {
        //使用硬编码id,并将其传入CoffeeService的findOne()方法
        const coffeeId = '1';
        const expectedCoffee = {};

        /*
        mockReturnValue是将 coffeeRepository 对象中的 findOne 方法的返回值设置为 expectedCoffee。
        这里使用了 Jest 的 mock 功能，意味着我们可以控制 findOne 方法的返回值，以便测试 CoffeesService 类中使用 findOne 方法的代码。
        service.findOne(coffeeId);，是在实际运行 CoffeesService 类的 findOne 方法，将其返回值存储在 coffee 变量中。
        */
        coffeeRepository.findOne.mockReturnValue(expectedCoffee);
        const coffee = await service.findOne(coffeeId);
        expect(coffee).toEqual(expectedCoffee); //对测试断言
      });
    });
    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        const coffeeId = '1';
        coffeeRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne(coffeeId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Coffee #${coffeeId} not found`);
        }
      });
    });
  });
});

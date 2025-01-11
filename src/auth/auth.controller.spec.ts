import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from '../common/dto';
import { User } from '../users/users.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  const mockUser: User = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password',
    role: 1,
    isActive: true,
    createDateTime: new Date(),
    createdBy: 'testUser',
    lastChangedDateTime: new Date(),
    lastChangedBy: 'testUser',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            createToken: jest.fn(),
            register: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a user and token', async () => {
      const loginDto: LoginDto = {
        email: 'john.doe@example.com',
        password: 'password',
      };
      const result = {
        user: mockUser,
        expiresIn: '3600',
        accessToken: 'jwt-token',
      };
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(authService, 'createToken').mockResolvedValue(result);

      await expect(controller.login(loginDto)).resolves.toBe(result);
    });
  });

  describe('register', () => {
    it('should return a registered user', async () => {
      const registerDto: RegisterDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
      };
      const result = { user: mockUser, token: 'jwt-token' };
      jest.spyOn(authService, 'register').mockResolvedValue(result);

      await expect(controller.register(registerDto)).resolves.toBe(result);
    });
  });

  describe('me', () => {
    it('should return the current user', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);

      await expect(controller.getLoggedInUser(mockUser)).resolves.toBe(
        mockUser,
      );
    });
  });
});

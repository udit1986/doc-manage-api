import { DataSource } from 'typeorm';
import { User } from '../../users/users.entity';
import { faker } from '@faker-js/faker';

export class UserSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    for (let i = 0; i < 1000; i++) {
      const user = new User();
      user.firstName = faker.person.firstName();
      user.lastName = faker.person.lastName();
      user.email = faker.internet.email();
      user.password = faker.internet.password();
      user.role = faker.helpers.arrayElement([1, 2, 3]);
      user.createdBy = faker.person.firstName();
      user.lastChangedBy = faker.person.firstName();

      await userRepository.save(user);
    }
  }
}
import { UserSeeder } from './user.seed';
import dataSource from '../../../typeorm.config';

async function runSeeders() {
  const ds = await dataSource.initialize();
  const userSeeder = new UserSeeder();
  await userSeeder.run(ds);
  await ds.destroy();
}

runSeeders().catch(console.error);
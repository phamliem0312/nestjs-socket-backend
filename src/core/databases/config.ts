import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const config: MysqlConnectionOptions = {
  type: 'mysql',
  database: 'ckvn',
  username: 'root',
  password: '',
  host: 'localhost',
  entities: ['dist/models/**/*.entity{.ts,.js}'],
  synchronize: false,
  dropSchema: false,
  migrations: ['dist/database/migrations/*.js'],
};

export default config;

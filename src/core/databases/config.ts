import { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      database: 'ckvn',
      user: 'root',
      password: '031298',
      host: '127.0.0.1',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: '../db/knex_migrations',
    },
  },
};

export default config;

import { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  production: {
    client: 'mysql2',
    connection: {
      database: 'wserver',
      user: 'socketserver',
      password: '123456aA@',
      host: '45.125.236.31',
    },
    pool: {
      min: 2,
      max: 20,
    },
    migrations: {
      tableName: '../db/knex_migrations',
    },
  },
};

export default config;

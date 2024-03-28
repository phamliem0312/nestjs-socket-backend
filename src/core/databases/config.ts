import { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  production: {
    client: 'mysql2',
    connection: {
      database: 'socketdb',
      user: 'root',
      password: '',
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

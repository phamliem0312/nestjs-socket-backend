import { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  production: {
    client: 'mysql2',
    connection: {
      database: 'socketdb',
      user: 'socketclient',
      password: '123456a@',
      host: '45.125.236.58',
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

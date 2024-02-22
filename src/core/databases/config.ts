import { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      database: 'ckvn',
      user: 'fclientuser',
      password: '123456a@',
      host: '103.179.189.71',
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

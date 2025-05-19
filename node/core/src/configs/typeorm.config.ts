import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

const DB_HOST = process.env.DB_HOST || 'host.docker.internal';
const DB_PORT = process.env.DB_PORT || 5432;
const DB_USERNAME = process.env.DB_USERNAME || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
const DB_DATABASE = process.env.DB_DATABASE || 'postgres';

const dbConfig: DataSourceOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  entities: [path.join(__dirname, '../entities/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '../migrations/*.ts')],
  synchronize: false,
};

export default new DataSource(dbConfig);

export { dbConfig };

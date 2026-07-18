import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Event } from '../events/entities/event.entity';
import { Feedback } from '../events/entities/feedback.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'better-sqlite3',
  database: process.env.DATABASE_PATH ?? './data/db.sqlite',
  entities: [Event, Feedback],
  migrations: [`${__dirname}/migrations/*.{ts,js}`],
  synchronize: false,
};

export default new DataSource(dataSourceOptions);

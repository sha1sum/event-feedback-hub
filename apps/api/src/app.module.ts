import { join } from 'node:path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { Request } from 'express';
import { dataSourceOptions } from './database/data-source';
import { EventsModule } from './events/events.module';

interface GraphqlContextFactoryArgs {
  req: Request;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req }: GraphqlContextFactoryArgs) => ({ req }),
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
        },
      },
    }),
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

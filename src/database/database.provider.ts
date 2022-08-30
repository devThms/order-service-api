import { createConnection } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'A_LOCAL_CONNECTION',
    useFactory: async () =>
      await createConnection({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'order_service_db',
        entities: [__dirname + '/../**/local/*.entity{.ts,.js}'],
        synchronize: true,
      }),
  }
];

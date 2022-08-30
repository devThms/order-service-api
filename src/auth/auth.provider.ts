import { Connection } from "typeorm";
import { User } from "./../user/local/user.entity";

export const authProviders = [
    {
        provide: 'AUTH_REPOSITORY',
        useFactory: (connection: Connection) => connection.getRepository(User),
        inject: ['A_LOCAL_CONNECTION'],
    },
];

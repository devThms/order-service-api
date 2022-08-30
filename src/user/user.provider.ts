import { Connection } from "typeorm";
import { User } from "./local/user.entity";

export const userProviders = [
    {
        provide: 'USER_REPOSITORY',
        useFactory: (connection: Connection) => connection.getRepository(User),
        inject: ['A_LOCAL_CONNECTION'],
    },
];

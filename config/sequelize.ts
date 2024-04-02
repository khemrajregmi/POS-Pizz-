
import { Sequelize } from 'sequelize-typescript';
export const sequelizeConnection = new Sequelize({
    dialect: 'postgres',
    host: 'database',
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
});

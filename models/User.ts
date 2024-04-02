import { Sequelize, DataTypes, Model, HasManyAddAssociationMixin, HasManyGetAssociationsMixin } from 'sequelize';


import { Order } from './Order';
import { sequelizeConnection } from '../config/sequelize';

export class User extends Model {
    public user_id!: number;
    public username!: string;
    public email!: string;
    public passwordHash!: string;

    // Association methods
    public getOrders!: HasManyGetAssociationsMixin<Order>;
    public addOrder!: HasManyAddAssociationMixin<Order, number>;

    // Timestamps
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

User.init({
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
}, {
    sequelize: sequelizeConnection,
    modelName: 'User',
    tableName: 'users'
});

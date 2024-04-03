import { User } from './User';
import { OrderItem } from './OrderItem';
import { Sequelize, DataTypes, Model, BelongsToGetAssociationMixin, HasManyGetAssociationsMixin } from 'sequelize';
import { sequelizeConnection } from '../config/sequelize';


export enum OrderStatus {
    Pending = "pending",
    InPreparation = "in_preparation",
    ReadyForPickup = "ready_for_pickup",
    Completed = "completed"
}

export class Order extends Model {
    public order_id!: number;
    public user_id!: number; // Foreign key reference to User
    public status!: string;

    // Association methods
    public getUser!: BelongsToGetAssociationMixin<User>;
    // public getOrderItems!: HasManyGetAssociationsMixin<OrderItem>;

    // Timestamps
    public readonly created_at!: Date;
    public readonly updated_at!: Date;}

Order.init({
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    status: {
        type: DataTypes.ENUM,
        values: Object.values(OrderStatus),
        allowNull: false
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
}, {
    sequelize: sequelizeConnection,
    modelName: 'Order',
    tableName: 'orders'
});

Order.hasMany(OrderItem, {
    foreignKey: 'order_id', // Ensure this matches the foreign key in the OrderItem model
    as: 'orderItems' // This is the alias used in queries
});


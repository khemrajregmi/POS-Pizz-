import { Model, DataTypes, Sequelize } from 'sequelize';
import { sequelizeConnection } from '../config/sequelize';
import { OrderItem } from './OrderItem';


export class Pizza extends Model { // Add 'export' here
    public pizza_id!: number;
    public name!: string;
    public description!: string;
    public price!: number;
    public image_url!: string;

    // Timestamps
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

Pizza.init({
    pizza_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: DataTypes.TEXT,
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    image_url: DataTypes.STRING
}, {
    sequelize: sequelizeConnection,
    modelName: 'Pizza',
    tableName: 'pizzas'
});

import { Sequelize, DataTypes, Model } from 'sequelize';
import { Order } from './Order';
import { Pizza } from './Pizza';
import { sequelizeConnection } from '../config/sequelize';

export class OrderItem extends Model {
    static associate(models: any) {
        // Define associations here
        // Example:
        OrderItem.belongsTo(models.Pizza, { foreignKey: 'pizza_id', as: 'pizza' });
    }
}

OrderItem.init({
    order_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Order,
            key: 'order_id'
        }
    },
    pizza_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Pizza,
            key: 'pizza_id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
}, {
    sequelize: sequelizeConnection,
    modelName: 'OrderItem',
    tableName: 'order_items'
});

OrderItem.belongsTo(Pizza, {
    foreignKey: 'pizza_id',
    as: 'pizza' // Optional alias
});

// OrderItem.hasMany(Pizza, {
//   foreignKey: 'pizza_id',
//   as: 'pizza' // Optional alias
// });

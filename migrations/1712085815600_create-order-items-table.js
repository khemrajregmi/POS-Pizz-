/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('order_items', {
        order_item_id: { type: 'serial', primaryKey: true },
        order_id: { type: 'integer', references: '"orders"', onDelete: 'CASCADE' },
        pizza_id: { type: 'integer', references: '"pizzas"', onDelete: 'CASCADE' },
        quantity: { type: 'integer', notNull: true },
        total_price: { type: 'numeric', notNull: true },
        created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamp' }
    });
};

exports.down = (pgm) => {
    pgm.dropTable('order_items');
};

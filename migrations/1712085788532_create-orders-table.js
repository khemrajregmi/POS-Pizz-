/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('orders', {
        order_id: { type: 'serial', primaryKey: true },
        user_id: { type: 'integer', references: '"users"', onDelete: 'CASCADE' },
        status: { type: 'string'},
        total_price: { type: 'numeric', notNull: true },
        created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamp' }
    });
};

exports.down = (pgm) => {
    pgm.dropTable('orders');
};
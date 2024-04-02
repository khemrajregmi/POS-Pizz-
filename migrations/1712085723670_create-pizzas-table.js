/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('pizzas', {
        pizza_id: { type: 'serial', primaryKey: true },
        name: { type: 'varchar(255)', notNull: true },
        description: { type: 'text' },
        price: { type: 'numeric', notNull: true },
        image_url: { type: 'text' },
        created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamp' }
    });
};

exports.down = (pgm) => {
    pgm.dropTable('pizzas');
};
/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('users', {
        user_id: { type: 'serial', primaryKey: true },
        username: { type: 'varchar(255)', notNull: true, unique: true },
        email: { type: 'varchar(255)', notNull: true, unique: true },
        password_hash: { type: 'text', notNull: true },
        created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamp' }
    });
};

exports.down = (pgm) => {
    pgm.dropTable('users');
};
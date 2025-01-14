'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.sequelize.query(`
      INSERT INTO categories (id, category_name)
      VALUES (0, 'Other')
      ON CONFLICT DO NOTHING;
    `);
    },

    async down(queryInterface) {
        await queryInterface.sequelize.query(`
      DELETE FROM categories WHERE id = 0;
    `);
    },
};

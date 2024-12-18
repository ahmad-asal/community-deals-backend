'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create categories table
    await queryInterface.createTable('categories', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      category_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop categories table
    await queryInterface.dropTable('categories');
  },
};

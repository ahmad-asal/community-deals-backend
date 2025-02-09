'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Change the column type to TEXT
        await queryInterface.changeColumn('deals', 'description', {
            type: Sequelize.TEXT,
            allowNull: false,
        });
    },

    async down(queryInterface, Sequelize) {
        // Revert the column type back to STRING (optional, for rollback)
        await queryInterface.changeColumn('deals', 'description', {
            type: Sequelize.STRING,
            allowNull: false,
        });
    },
};

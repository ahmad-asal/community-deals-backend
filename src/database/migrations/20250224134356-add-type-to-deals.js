'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('deals', 'type', {
            type: Sequelize.ENUM('I Want to', 'I Need to', 'Other'),
            allowNull: false,
            defaultValue: 'Other',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('deals', 'type');
    },
};

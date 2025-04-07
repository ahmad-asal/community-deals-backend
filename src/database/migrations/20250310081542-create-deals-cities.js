'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('deal_cities', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            dealId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'deals', // Make sure the table name is correct
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            cityId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'cities', // Make sure the table name is correct
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('deal_cities');
    },
};

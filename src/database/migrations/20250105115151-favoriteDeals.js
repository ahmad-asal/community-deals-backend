'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('favorite_deal', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            dealId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'deals',
                    key: 'id',
                },
            },
            userId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'user',
                    key: 'id',
                },
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        });

        await queryInterface.addConstraint('favorite_deal', {
            fields: ['dealId', 'userId'],
            type: 'unique',
            name: 'favorite_deals__unique_constraint',
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('favorite_deal');
        await queryInterface.removeConstraint(
            'favorite_deal',
            'favorite_deals__unique_constraint',
        );
    },
};

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user_role', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            roleId: {
                // field: 'roleId',
                type: Sequelize.INTEGER,
                references: {
                    model: 'role',
                    key: 'id',
                },
            },
            userId: {
                // field: 'userId',
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
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('user_role');
    },
};

'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('otp', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    isEmail: true,
                },
            },
            otp: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            expiresAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            isUsed: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        // Add index for faster queries
        await queryInterface.addIndex('otp', ['email', 'isUsed', 'expiresAt'], {
            name: 'otp_lookup_idx',
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Remove index first
        await queryInterface.removeIndex('otp', 'otp_lookup_idx');
        // Then drop the table
        await queryInterface.dropTable('otp');
    },
};

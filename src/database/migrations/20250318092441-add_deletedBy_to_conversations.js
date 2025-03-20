'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.addColumn('Conversations', 'deletedBy', {
            type: Sequelize.JSON, // Use JSON type to store an array
            allowNull: true,
            defaultValue: [],
        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('Conversations', 'deletedBy');
    },
};

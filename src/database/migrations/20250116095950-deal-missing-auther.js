'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('deals', 'autherId', {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: true,
        });

        await queryInterface.addConstraint('deals', {
            type: 'foreign key',
            name: 'FK_deal_autherId',
            fields: ['autherId'],
            references: {
                table: 'user',
                field: 'id',
            },
            onDelete: 'SET NULL',
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('deals', 'autherId');
    },
};

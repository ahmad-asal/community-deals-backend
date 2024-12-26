'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.sequelize.transaction(async transaction => {
            await queryInterface.addColumn(
                'user',
                'status',
                {
                    type: Sequelize.DataTypes.ENUM(
                        'pending',
                        'active',
                        'suspended',
                    ),
                    allowNull: true,
                },
                { transaction },
            );

            // https://sequelize.org/docs/v6/core-concepts/raw-queries/#bind-parameter
            await queryInterface.sequelize.query(
                'UPDATE "user" SET status = $status',
                {
                    bind: { status: 'active' },
                    type: Sequelize.QueryTypes.UPDATE,
                    transaction,
                },
            );

            await queryInterface.changeColumn(
                'user',
                'status',
                {
                    defaultValue: 'pending',
                    allowNull: false,
                    type: Sequelize.DataTypes.ENUM(
                        'pending',
                        'active',
                        'suspended',
                    ),
                },
                { transaction },
            );
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('user', 'status');
    },
};

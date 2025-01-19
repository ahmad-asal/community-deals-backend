'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.sequelize.transaction(async transaction => {
            await queryInterface.addColumn(
                'user',
                'jobTitle',
                {
                    type: Sequelize.DataTypes.STRING,
                    allowNull: true,
                },
                { transaction },
            );
            await queryInterface.addColumn(
                'user',
                'companyName',
                {
                    type: Sequelize.DataTypes.STRING,
                    allowNull: true,
                },
                { transaction },
            );
            await queryInterface.addColumn(
                'user',
                'phoneNumber',
                {
                    type: Sequelize.DataTypes.STRING,
                    allowNull: true,
                },
                { transaction },
            );
            await queryInterface.addColumn(
                'user',
                'address',
                {
                    type: Sequelize.DataTypes.STRING,
                    allowNull: true,
                },
                { transaction },
            );
            await queryInterface.addColumn(
                'user',
                'profileImg',
                {
                    type: Sequelize.DataTypes.STRING,
                    allowNull: true,
                },
                { transaction },
            );
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('user', 'jobTitle');
        await queryInterface.removeColumn('user', 'companyName');
        await queryInterface.removeColumn('user', 'phoneNumber');
        await queryInterface.removeColumn('user', 'address');
        await queryInterface.removeColumn('user', 'profileImg');
    },
};

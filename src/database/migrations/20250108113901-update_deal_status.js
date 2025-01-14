/* eslint-disable prettier/prettier */
'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */

        // PostgreSQL doesn't allow modifying an ENUM type directly through a changeColumn statement in Sequelize. Instead, you need to use raw SQL to add the new value:
        // await queryInterface.changeColumn('deals', 'status', {
        //   type:Sequelize.ENUM('In Review', 'Approved', 'Rejected', 'Deleted'),
        //   allowNull: false
        // })

        await queryInterface.sequelize.query(`
      ALTER TYPE "enum_deals_status" ADD VALUE 'Deleted';
  `);
    },

    async down() {
        // Unfortunately, PostgreSQL does not allow removing values from ENUM types directly.
        // To rollback, you'd need to create a new ENUM type without the 'Deleted' value and reassign the column to it.
        console.warn(
            'Rollback not supported for ENUM value removal in PostgreSQL.',
        );
    },
};

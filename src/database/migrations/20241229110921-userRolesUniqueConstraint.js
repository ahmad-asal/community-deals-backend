'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        queryInterface.addConstraint('user_role', {
            fields: ['roleId', 'userId'],
            type: 'unique',
            name: 'users_roles_unique_constraint',
        });
    },

    async down(queryInterface) {
        queryInterface.removeConstraint(
            'user_role',
            'users_roles_unique_constraint',
        );
    },
};

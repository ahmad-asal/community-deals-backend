'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */

        return queryInterface.bulkInsert('user', [
            {
                username: 'user1',
                name: 'user1',
                email: 'user1@example.com',
                password: '6t56h',
                jobTitle: 'eng',
                companyName: 'mena',
                phoneNumber: '988-23125',
                address: 'Nablus, tel',
                profileImg: 'www.google.com',

                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                username: 'user2',
                name: 'user2',
                email: 'user2@example.com',
                password: '6t56h',
                jobTitle: 'eng',
                companyName: 'mena',
                phoneNumber: '988-23125',
                address: 'Nablus, tel',
                profileImg: 'www.google.com',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                username: 'user3',
                name: 'user3',
                email: 'user3@example.com',
                password: '6t56h',
                jobTitle: 'eng',
                companyName: 'mena',
                phoneNumber: '988-23125',
                address: 'Nablus, tel',
                profileImg: 'www.google.com',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    async down() {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};

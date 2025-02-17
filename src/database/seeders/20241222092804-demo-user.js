'use strict';

const { hash } = require("bcrypt");
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
        const hashedPassword = await hash('6t56hAb8cs', 10);
        return queryInterface.bulkInsert('user', [
            {
                username: 'user111',
                name: 'user1',
                email: 'user111@example.com',
                password: hashedPassword,
                jobTitle: 'eng',
                companyName: 'mena',
                phoneNumber: '988-23125',
                address: 'Nablus, tel',
                profileImg: 'www.google.com',
                status: 'active',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                username: 'user211',
                name: 'user2',
                email: 'user211@example.com',
                password: hashedPassword,
                jobTitle: 'eng',
                companyName: 'mena',
                phoneNumber: '988-23125',
                address: 'Nablus, tel',
                status: 'active',
                profileImg: 'www.google.com',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                username: 'user311',
                name: 'user3',
                email: 'user311@example.com',
                password: hashedPassword,
                jobTitle: 'eng',
                companyName: 'mena',
                phoneNumber: '988-23125',
                address: 'Nablus, tel',
                status: 'active',
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

'use strict';

const { hash } = require("bcrypt");
const { Op } = require("sequelize");
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
        try {
            const hashedPassword = await hash('6t56hAb8cs', 10);
            
            // Check for existing users
            const existingUsers = await queryInterface.sequelize.query(
                `SELECT username FROM "user" WHERE username IN ('user1', 'user2', 'user3')`,
                { type: queryInterface.sequelize.QueryTypes.SELECT }
            );
            
            const existingUsernames = existingUsers.map(user => user.username);
            const usersToInsert = [
                {
                    username: 'user1',
                    name: 'user1',
                    email: 'user1@example.com',
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
                    username: 'user2',
                    name: 'user2',
                    email: 'user2@example.com',
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
                    username: 'user3',
                    name: 'user3',
                    email: 'user3@example.com',
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
            ].filter(user => !existingUsernames.includes(user.username));

            if (usersToInsert.length > 0) {
                await queryInterface.bulkInsert('user', usersToInsert);
                console.log(`Successfully inserted ${usersToInsert.length} new users`);
            } else {
                console.log('All demo users already exist in the database');
            }
        } catch (error) {
            console.error('Error in demo-user seeder:', error);
            throw error;
        }
    },

    async down(queryInterface) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        try {
            await queryInterface.bulkDelete('user', {
                email: {
                    [Op.in]: ['user1@example.com', 'user2@example.com', 'user3@example.com']
                }
            });
        } catch (error) {
            console.error('Error in demo-user seeder down:', error);
            throw error;
        }
    },
};

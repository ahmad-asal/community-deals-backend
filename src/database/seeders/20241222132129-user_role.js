'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        try {
            // Check for existing role assignments
            const existingAssignments = await queryInterface.sequelize.query(
                `SELECT "userId", "roleId" FROM "user_role" WHERE ("userId", "roleId") IN ((1, 1), (1, 2))`,
                { type: queryInterface.sequelize.QueryTypes.SELECT }
            );
            
            const existingPairs = existingAssignments.map(assignment => 
                `${assignment.userId}-${assignment.roleId}`
            );
            
            const assignmentsToInsert = [
                {
                    userId: 1,
                    roleId: 1,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    userId: 1,
                    roleId: 2,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ].filter(assignment => 
                !existingPairs.includes(`${assignment.userId}-${assignment.roleId}`)
            );

            if (assignmentsToInsert.length > 0) {
                await queryInterface.bulkInsert('user_role', assignmentsToInsert);
                console.log(`Successfully inserted ${assignmentsToInsert.length} new role assignments`);
            } else {
                console.log('All role assignments already exist in the database');
            }
        } catch (error) {
            console.error('Error in user_role seeder:', error);
            throw error;
        }
    },

    async down(queryInterface, Sequelize) {
        try {
            await queryInterface.bulkDelete('user_role', {
                userId: 1,
                roleId: {
                    [Sequelize.Op.in]: [1, 2]
                }
            });
        } catch (error) {
            console.error('Error in user_role seeder down:', error);
            throw error;
        }
    },
};

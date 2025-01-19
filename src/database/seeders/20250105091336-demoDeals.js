'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async queryInterface => {
        await queryInterface.bulkInsert('deals', [
            {
                title: 'Acquisition of Sunrise Hotel',
                description:
                    'Acquisition of a 200-room luxury hotel located in downtown Manhattan.',
                categoryId: 1,
                status: 'In Review',
                autherId: 1,
                expiryDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Acquisition of Northern Heights Residences',
                description:
                    'Acquisition of a high-rise apartment building in the northern suburbs.',
                status: 'In Review',
                autherId: 1,
                categoryId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Acquisition of Downtown Plaza Shops',
                description:
                    'Acquisition of 8 boutique shops in the downtown plaza.',
                categoryId: 3,
                status: 'In Review',
                autherId: 1,
                expiryDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Black Friday Special',
                description: 'Massive discounts on electronics and gadgets.',
                categoryId: 1,
                status: 'In Review',
                autherId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Acquisition of GlobalMart Stores',
                description:
                    'Acquisition of 10 GlobalMart retail stores across the state.',
                categoryId: 1,
                status: 'In Review',
                autherId: 1,
                expiryDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Back to School',
                description: 'Special deals on school supplies and backpacks.',
                categoryId: 1,
                status: 'In Review',
                autherId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Summer Clearance',
                description: 'Up to 70% off on summer items.',
                categoryId: 1,
                status: 'In Review',
                autherId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Cyber Monday',
                description: 'Exclusive online-only deals for one day only.',
                categoryId: 1,
                status: 'In Review',
                autherId: 1,
                expiryDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Free Shipping Week',
                description: 'Enjoy free shipping on all orders above $50.',
                categoryId: 1,
                status: 'In Review',
                autherId: 1,
                expiryDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Valentine’s Day Special',
                description: 'Discounts on chocolates, flowers, and gifts.',
                categoryId: 1,
                status: 'In Review',
                autherId: 1,
                expiryDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async queryInterface => {
        await queryInterface.bulkDelete('deals', null, {});
    },
};

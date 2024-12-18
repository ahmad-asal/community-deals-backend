module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('categories', [
      {
        category_name: 'Outsourcing'
      },
      {
        category_name: 'Partnerships'
      },
      {
        category_name: 'Real Estate'
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('categories', null, {});
  },
};

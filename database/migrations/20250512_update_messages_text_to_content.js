module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the 'content' column as NULL initially
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn('messages', 'content', {
        type: Sequelize.JSONB,
        allowNull: true,
      }, { transaction });

      // Update existing records to have a default value for the 'content' column
      await queryInterface.bulkUpdate(
        'messages',
        { content: {} },
        { content: null },
        { transaction }
      );

      // Alter the column to make it NOT NULL
      await queryInterface.changeColumn('messages', 'content', {
        type: Sequelize.JSONB,
        allowNull: false,
      }, { transaction });

      // Remove the 'text' column
      await queryInterface.removeColumn('messages', 'text', { transaction });
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the 'content' column back to 'text' with type STRING
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn('messages', 'text', {
        type: Sequelize.STRING,
        allowNull: true,
      }, { transaction });
      await queryInterface.removeColumn('messages', 'content', { transaction });
    });
  },
};

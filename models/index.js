import sequelize from '../config/database.js';
import Conversation from './Conversation.js';
import Message from './Message.js';

// Inicializa todos os modelos e associações
const models = {
  Conversation,
  Message,
  sequelize
};

// Sincroniza o banco de dados
export const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    
    // Force: true irá dropar a tabela se ela já existir (use com cuidado)
    await sequelize.sync({ force: false, alter: true });
    console.log('Todos os modelos sincronizados com sucesso.');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
    throw error;
  }
};

export default models;

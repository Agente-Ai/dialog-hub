import { syncDatabase } from '../models/index.js';

// Função para executar a migração
const migrate = async () => {
  try {
    console.log('Iniciando migração do banco de dados...');
    await syncDatabase();
    console.log('Migração concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro durante a migração:', error);
    process.exit(1);
  }
};

// Executar migração
migrate();

import { syncDatabase } from '../models/index.js';

(async () => {
  try {
    console.log('Iniciando sincronização do banco de dados...');
    await syncDatabase();
    console.log('Sincronização concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro durante a sincronização do banco de dados:', error);
    process.exit(1);
  }
})();

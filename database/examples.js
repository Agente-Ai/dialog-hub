import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import sequelize from '../config/database.js';

/**
 * Este script contém exemplos de consultas ao banco de dados.
 * Execute com: node database/examples.js
 */
async function runExamples() {
  try {
    console.log('Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('Conexão estabelecida com sucesso!');
    
    // Exemplo 1: Buscar todas as conversas ativas com suas mensagens
    console.log('\nExemplo 1: Conversas ativas com mensagens');
    const activeConversations = await Conversation.findAll({
      where: { status: 'active' },
      include: [Message],
      limit: 2
    });
    
    console.log(`Encontradas ${activeConversations.length} conversas ativas.`);
    if (activeConversations.length > 0) {
      const conversation = activeConversations[0];
      console.log(`Detalhes da conversa #${conversation.id}:`);
      console.log(`  - Número do cliente: ${conversation.from}`);
      console.log(`  - Número exibido: ${conversation.displayPhoneNumber}`);
      console.log(`  - Mensagens: ${conversation.Messages?.length || 0}`);
    }
    
    // Exemplo 2: Contar mensagens por tipo
    console.log('\nExemplo 2: Contagem de mensagens por tipo');
    const outgoingCount = await Message.count({ where: { type: 'outgoing' } });
    const incomingCount = await Message.count({ where: { type: 'incoming' } });
    console.log(`Mensagens enviadas: ${outgoingCount}`);
    console.log(`Mensagens recebidas: ${incomingCount}`);
    
    // Exemplo 3: Encontrar última mensagem de cada conversa
    console.log('\nExemplo 3: Última mensagem de cada conversa');
    const conversations = await Conversation.findAll({
      limit: 3,
      include: [
        {
          model: Message,
          limit: 1,
          order: [['created_at', 'DESC']]
        }
      ]
    });
    
    for (const conversation of conversations) {
      const lastMessage = conversation.Messages?.length > 0 ? conversation.Messages[0] : null;
      console.log(`Conversa #${conversation.id} - Último contato: ${lastMessage?.createdAt || 'N/A'}`);
      if (lastMessage) {
        console.log(`  Mensagem: ${lastMessage.text.substring(0, 30)}...`);
      }
    }
    
    console.log('\nExemplos concluídos com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro durante a execução dos exemplos:', error);
    process.exit(1);
  }
}

// Executar os exemplos
runExamples();

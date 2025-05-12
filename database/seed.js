import { v4 as uuidv4 } from 'uuid';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import sequelize from '../config/database.js';

// Função para criar dados de exemplo
async function seedDatabase() {
  try {
    console.log('Conectando ao banco de dados...');
    await sequelize.authenticate();
    
    console.log('Criando dados de exemplo...');
    
    // Criando conversas de exemplo
    const conversations = [];
    for (let i = 0; i < 5; i++) {
      const phoneNumber = `551199${Math.floor(1000000 + Math.random() * 9000000)}`;
      const formattedPhoneNumber = `+55 (11) 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const conversation = await Conversation.create({
        whatsappBusinessAccountId: '123456789',
        phoneNumberId: '987654321',
        displayPhoneNumber: formattedPhoneNumber,
        from: phoneNumber,
        status: i % 4 === 0 ? 'closed' : 'active'
      });
      conversations.push(conversation);
    }
    
    // Criando mensagens de exemplo para cada conversa
    const messageTemplates = [
      'Olá, preciso de ajuda!',
      'Como posso resolver meu problema?',
      'Gostaria de mais informações sobre o produto.',
      'Qual o prazo de entrega?',
      'Obrigado pela ajuda!',
      'Isso resolveu meu problema.',
      'Poderia me ajudar com outra questão?',
      'Estou com dificuldades para fazer o pagamento.'
    ];
    
    const responseTemplates = [
      'Olá! Como posso ajudar?',
      'Vou verificar isso para você.',
      'O prazo de entrega é de 3 a 5 dias úteis.',
      'Poderia me fornecer mais detalhes sobre seu problema?',
      'Ficamos felizes em ajudar!',
      'Precisamos de mais informações para resolver isso.',
      'Você pode tentar reiniciar o aplicativo.',
      'Nossa equipe entrará em contato com você em breve.'
    ];
    
    for (const conversation of conversations) {
      // Número aleatório de mensagens para cada conversa (2 a 10)
      const messageCount = Math.floor(2 + Math.random() * 8);
      
      for (let i = 0; i < messageCount; i++) {
        // Alternando entre mensagens recebidas e enviadas
        const isIncoming = i % 2 === 0;
        const type = isIncoming ? 'incoming' : 'outgoing';
        
        // Cria um timestamp aleatório nas últimas 48 horas
        const timestamp = new Date(Date.now() - Math.floor(Math.random() * 48 * 60 * 60 * 1000));
        
        // Seleciona um texto de mensagem aleatório
        const text = isIncoming 
          ? messageTemplates[Math.floor(Math.random() * messageTemplates.length)]
          : responseTemplates[Math.floor(Math.random() * responseTemplates.length)];
        
        // Cria a mensagem
        await Message.create({
          messageId: isIncoming ? `wamid.${uuidv4().replace(/-/g, '')}` : null,
          text,
          type,
          timestamp,
          ConversationId: conversation.id,
          metadata: isIncoming ? {
            from: conversation.from,
            id: `wamid.${uuidv4().replace(/-/g, '')}`,
            timestamp: Math.floor(timestamp.getTime() / 1000),
            type: 'text',
            text: { body: text }
          } : {
            phone_number_id: conversation.phoneNumberId,
            from: conversation.from,
            text
          }
        });
      }
    }
    
    console.log(`Criadas ${conversations.length} conversas com suas mensagens.`);
    console.log('Dados de exemplo criados com sucesso!');
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao criar dados de exemplo:', error);
    process.exit(1);
  }
}

// Executar a função de seed
seedDatabase();

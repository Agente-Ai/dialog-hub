import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

/**
 * Encontra ou cria uma conversa ativa
 */
export const findOrCreateConversation = async ({ whatsappBusinessAccountId, phoneNumberId, displayPhoneNumber, from }) => {
  try {
    // Buscar por uma conversa ativa existente
    let conversation = await Conversation.findOne({
      where: {
        whatsappBusinessAccountId,
        phoneNumberId,
        from,
        status: 'active'
      }
    });

    // Se a conversa existir, mas não tiver displayPhoneNumber, atualize-a
    if (conversation && displayPhoneNumber && !conversation.displayPhoneNumber) {
      conversation.displayPhoneNumber = displayPhoneNumber;
      await conversation.save();
    }
    
    // Se não existir, crie uma nova
    if (!conversation) {
      conversation = await Conversation.create({
        whatsappBusinessAccountId,
        phoneNumberId,
        displayPhoneNumber,
        from,
        status: 'active'
      });
      return { conversation, created: true };
    }

    return { conversation, created: false };
  } catch (error) {
    console.error('Erro ao encontrar ou criar conversa:', error);
    throw error;
  }
};

/**
 * Busca uma conversa por ID com suas mensagens
 */
export const getConversationById = async (id) => {
  try {
    return await Conversation.findByPk(id, {
      include: [{ 
        model: Message,
        order: [['timestamp', 'ASC']]
      }]
    });
  } catch (error) {
    console.error('Erro ao buscar conversa por ID:', error);
    throw error;
  }
};

/**
 * Fecha uma conversa ativa
 */
export const closeConversation = async (id) => {
  try {
    const conversation = await Conversation.findByPk(id);
    if (conversation) {
      conversation.status = 'closed';
      await conversation.save();
    }
    return conversation;
  } catch (error) {
    console.error('Erro ao fechar conversa:', error);
    throw error;
  }
};

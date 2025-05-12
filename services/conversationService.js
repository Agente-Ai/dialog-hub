import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

/**
 * Encontra ou cria uma conversa ativa
 */
export const findOrCreateConversation = async ({ whatsappBusinessAccountId, phoneNumberId, from, displayPhoneNumber }) => {
  try {
    const [conversation, created] = await Conversation.findOrCreate({
      where: {
        whatsappBusinessAccountId,
        phoneNumberId,
        from,
        status: 'active'
      },
      defaults: {
        displayPhoneNumber
      }
    });

    // Se a conversa já existir mas displayPhoneNumber não estiver definido, atualize-o
    if (!created && !conversation.displayPhoneNumber && displayPhoneNumber) {
      conversation.displayPhoneNumber = displayPhoneNumber;
      await conversation.save();
    }

    return { conversation, created };
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

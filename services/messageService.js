import Message from '../models/Message.js';
import { findOrCreateConversation } from './conversationService.js';

/**
 * Salva uma mensagem recebida do webhook do WhatsApp
 */
export const saveIncomingMessage = async (messageData) => {
  try {
    // Extrai dados relevantes da mensagem recebida
    const message = messageData.entry[0].changes[0].value.messages[0];
    const from = message.from;
    const messageId = message.id;
    const text = message.text.body;
    const timestamp = message.timestamp;
    
    const metadata = messageData.entry[0].changes[0].value.metadata;
    const phoneNumberId = metadata.phone_number_id;
    const displayPhoneNumber = metadata.display_phone_number;
    // Se wabaId não estiver presente, usa o id da entry
    const whatsappBusinessAccountId = metadata.wabaId || messageData.entry[0].id;
    
    // Encontra ou cria a conversa
    const { conversation } = await findOrCreateConversation({
      whatsappBusinessAccountId,
      phoneNumberId,
      displayPhoneNumber,
      from
    });

    // Cria a mensagem
    const savedMessage = await Message.create({
      messageId,
      text,
      type: 'incoming',
      timestamp: new Date(timestamp * 1000), // Converte timestamp Unix para Date
      ConversationId: conversation.id,
      metadata: messageData // Armazena todos os metadados para referência
    });

    return savedMessage;
  } catch (error) {
    console.error('Erro ao salvar mensagem recebida:', error);
    throw error;
  }
};

/**
 * Salva uma mensagem enviada para o API do WhatsApp
 */
export const saveOutgoingMessage = async (messageData) => {
  try {
    const { from, phone_number_id: phoneNumberId, text, display_phone_number: displayPhoneNumber } = messageData;
    
    // Encontra a conversa
    const { conversation } = await findOrCreateConversation({
      whatsappBusinessAccountId: messageData.whatsapp_business_account_id || messageData.whatsappBusinessAccountId || 'unknown',
      phoneNumberId,
      displayPhoneNumber,
      from
    });

    // Cria a mensagem
    const savedMessage = await Message.create({
      text,
      type: 'outgoing',
      ConversationId: conversation.id,
      metadata: messageData // Armazena os metadados adicionais
    });

    return savedMessage;
  } catch (error) {
    console.error('Erro ao salvar mensagem enviada:', error);
    throw error;
  }
};

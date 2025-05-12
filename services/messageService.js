import Message from '../models/Message.js';
import { findOrCreateConversation } from './conversationService.js';

/**
 * Salva uma mensagem recebida do webhook do WhatsApp
 */
export const saveIncomingMessage = async (messageData) => {
  try {
    console.log('Salvando mensagem recebida:', messageData);

    // Extrai dados relevantes da mensagem recebida
    const message = messageData.entry[0].changes[0].value.messages[0];
    const from = message.from;
    const messageId = message.id;
    const timestamp = message.timestamp;

    // Prepara o conteúdo da mensagem baseado no tipo da mensagem
    let content = {};

    // Processa diferentes tipos de conteúdo
    if (message.type === 'text' && message.text) {
      content = {
        type: 'text',
        text: message.text.body
      };
    } else if (message.type === 'image' && message.image) {
      content = {
        type: 'image',
        image: message.image
      };
    } else if (message.type === 'audio' && message.audio) {
      content = {
        type: 'audio',
        audio: message.audio
      };
    } else if (message.type === 'video' && message.video) {
      content = {
        type: 'video',
        video: message.video
      };
    } else if (message.type === 'document' && message.document) {
      content = {
        type: 'document',
        document: message.document
      };
    } else {
      // Fallback para outros tipos ou formatos desconhecidos
      content = {
        type: message.type || 'unknown',
        raw: message
      };
    }

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
      content,
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
    console.log('Salvando mensagem enviada:', messageData);

    // Extrai dados relevantes da mensagem enviada
    const { content, from, phone_number_id: phoneNumberId, display_phone_number: displayPhoneNumber, messageId } = messageData;

    // Encontra a conversa
    const { conversation } = await findOrCreateConversation({
      from,
      phoneNumberId,
      displayPhoneNumber,
      whatsappBusinessAccountId: messageData.whatsapp_business_account_id,
    });

    // Cria a mensagem
    const savedMessage = await Message.create({
      content,
      messageId,
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

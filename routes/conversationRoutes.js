import express from 'express';
import { 
  findOrCreateConversation, 
  getConversationById, 
  closeConversation 
} from '../services/conversationService.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

const router = express.Router();

/**
 * @swagger
 * /api/conversations:
 *   get:
 *     summary: Retorna todas as conversas
 *     tags: [Conversations]
 *     responses:
 *       200:
 *         description: Lista de conversas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Conversation'
 *       500:
 *         description: Erro no servidor
 */

// Listar todas as conversas
router.get('/conversations', async (req, res) => {
  try {
    const conversations = await Conversation.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(conversations);
  } catch (error) {
    console.error('Erro ao listar conversas:', error);
    res.status(500).json({ error: 'Erro ao buscar conversas' });
  }
});

// Buscar uma conversa específica com suas mensagens
/**
 * @swagger
 * /api/conversations/{id}:
 *   get:
 *     summary: Retorna uma conversa específica com suas mensagens
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID da conversa
 *     responses:
 *       200:
 *         description: Detalhes da conversa com suas mensagens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversation'
 *       404:
 *         description: Conversa não encontrada
 *       500:
 *         description: Erro no servidor
 */
router.get('/conversations/:id', async (req, res) => {
  try {
    const conversation = await getConversationById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversa não encontrada' });
    }
    res.json(conversation);
  } catch (error) {
    console.error('Erro ao buscar conversa:', error);
    res.status(500).json({ error: 'Erro ao buscar conversa' });
  }
});

// Fechar uma conversa
/**
 * @swagger
 * /api/conversations/{id}/close:
 *   put:
 *     summary: Fecha uma conversa ativa
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID da conversa
 *     responses:
 *       200:
 *         description: Conversa fechada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversation'
 *       404:
 *         description: Conversa não encontrada
 *       500:
 *         description: Erro no servidor
 */
router.put('/conversations/:id/close', async (req, res) => {
  try {
    const conversation = await closeConversation(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversa não encontrada' });
    }
    res.json(conversation);
  } catch (error) {
    console.error('Erro ao fechar conversa:', error);
    res.status(500).json({ error: 'Erro ao fechar conversa' });
  }
});

// Listar mensagens de uma conversa específica
/**
 * @swagger
 * /api/conversations/{id}/messages:
 *   get:
 *     summary: Retorna todas as mensagens de uma conversa
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID da conversa
 *     responses:
 *       200:
 *         description: Lista de mensagens da conversa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       500:
 *         description: Erro no servidor
 */
router.get('/conversations/:id/messages', async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { ConversationId: req.params.id },
      order: [['timestamp', 'ASC']]
    });
    res.json(messages);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
});

export default router;

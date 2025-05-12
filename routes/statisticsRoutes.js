import express from 'express';
import { getStatistics } from '../services/statisticsService.js';

const router = express.Router();

/**
 * @swagger
 * /api/statistics:
 *   get:
 *     summary: Retorna estatísticas gerais do sistema
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Estatísticas do sistema
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 conversations:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     active:
 *                       type: integer
 *                     closed:
 *                       type: integer
 *                     last24h:
 *                       type: integer
 *                 messages:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     incoming:
 *                       type: integer
 *                     outgoing:
 *                       type: integer
 *                     last24h:
 *                       type: integer
 *       500:
 *         description: Erro no servidor
 */
router.get('/statistics', async (req, res) => {
  try {
    const statistics = await getStatistics();
    res.json(statistics);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

export default router;

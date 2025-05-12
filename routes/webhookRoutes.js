import express from "express";
import { createWebhookController } from "../controllers/webhookController.js";

export default ({ GRAPH_API_TOKEN, WEBHOOK_VERIFY_TOKEN, publishToQueue }) => {
    const router = express.Router();

    const { handleWebhookPost, handleWebhookGet } = createWebhookController({
        GRAPH_API_TOKEN,
        WEBHOOK_VERIFY_TOKEN,
        publishToQueue,
    });

    /**
     * @swagger
     * /webhook:
     *   post:
     *     summary: Recebe notificações do WhatsApp
     *     tags: [Webhook]
     *     description: Endpoint para receber notificações do WhatsApp para mensagens e outros eventos
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *           example:
     *             object: "whatsapp_business_account"
     *             entry:
     *               - id: "1193249252340821"
     *                 changes:
     *                   - value:
     *                       messaging_product: "whatsapp"
     *                       metadata:
     *                         display_phone_number: "555131990963"
     *                         phone_number_id: "638465516014689"
     *                       contacts:
     *                         - profile:
     *                             name: "Murilo Eduardo Dos Santos"
     *                           wa_id: "555174019092"
     *                       messages:
     *                         - from: "555174019092"
     *                           id: "wamid.HBgMNTU1MTc0MDE5MDkyFQIAEhgWM0VCMDFFNDc4QzEyRUU5RjYyRTE4NQA="
     *                           timestamp: "1747066492"
     *                           text:
     *                             body: "Sempre pensei nisso!"
     *                           type: "text"
     *                     field: "messages"
     *     responses:
     *       200:
     *         description: Notificação recebida com sucesso
     */
    router.post("/webhook", handleWebhookPost);

    /**
     * @swagger
     * /webhook:
     *   get:
     *     summary: Verificação do webhook do WhatsApp
     *     tags: [Webhook]
     *     description: Endpoint para verificação do webhook pelo WhatsApp/Meta
     *     parameters:
     *       - in: query
     *         name: hub.mode
     *         schema:
     *           type: string
     *         required: true
     *         description: Modo da hub
     *       - in: query
     *         name: hub.verify_token
     *         schema:
     *           type: string
     *         required: true
     *         description: Token de verificação
     *       - in: query
     *         name: hub.challenge
     *         schema:
     *           type: string
     *         required: true
     *         description: Desafio a ser retornado para verificação
     *     responses:
     *       200:
     *         description: Verificação bem-sucedida
     *       403:
     *         description: Verificação falhou
     */
    router.get("/webhook", handleWebhookGet);

    return router;
};
import { saveIncomingMessage } from '../services/messageService.js';

export const createWebhookController = ({ publishToQueue }) => {
    const handleWebhookPost = async (req, res) => {
        try {
            // Salva a mensagem recebida no banco de dados
            await saveIncomingMessage(req.body);

            // Publica na fila para processamento adicional
            publishToQueue(req.body, "incoming.messages");
        } catch (error) {
            console.error("Falha ao processar mensagem:", error);
        }

        res.sendStatus(200);
    };

    const handleWebhookGet = (req, res) => {
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];

        if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    };

    return { handleWebhookPost, handleWebhookGet };
};
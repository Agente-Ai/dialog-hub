import axios from "axios";
import { saveOutgoingMessage } from "../services/messageService.js";

const consumerToSend = ({ rabbitMQChannel, GRAPH_API_TOKEN }) => {
    // Ensure the queue is not re-declared here
    rabbitMQChannel.consume("messages.to_send", async (msg) => {
        if (msg == null) return;

        const messageContent = JSON.parse(msg.content.toString());

        try {
            // Envia a mensagem via API do WhatsApp
            const requestBody = {
                to: messageContent.from,
                type: messageContent.type,
                ...messageContent.content,
                messaging_product: "whatsapp",
            };

            // Envia a mensagem para a API do WhatsApp
            const response = await axios.post(
                `https://graph.facebook.com/v22.0/${messageContent.phone_number_id}/messages`,
                requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Success send request message Meta:", response.data);

            const { id: messageId } = [response.data.messages];

            // Salva a mensagem enviada no banco de dados primeiro
            await saveOutgoingMessage({ ...messageContent, messageId });

            rabbitMQChannel.ack(msg);
        } catch (error) {
            console.error("Failed to send message:", error.response?.data || error.message);
        }
    });
};

export default consumerToSend;
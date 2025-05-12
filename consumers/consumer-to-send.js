import axios from "axios";
import { saveOutgoingMessage } from "../services/messageService.js";

const consumerToSend = ({ rabbitMQChannel, GRAPH_API_TOKEN }) => {
    // Ensure the queue is not re-declared here
    rabbitMQChannel.consume("messages.to_send", async (msg) => {
        if (msg !== null) {
            const messageContent = JSON.parse(msg.content.toString());

            try {
                // Salva a mensagem enviada no banco de dados primeiro
                await saveOutgoingMessage(messageContent);
                
                // Envia a mensagem via API do WhatsApp
                const response = await axios.post(
                    `https://graph.facebook.com/v22.0/${messageContent.phone_number_id}/messages`,
                    {
                        messaging_product: "whatsapp",
                        to: messageContent.from,
                        type: "text",
                        text: messageContent.text,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${GRAPH_API_TOKEN}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                console.log("Success send request message Meta:", response.data);

            } catch (error) {
                console.error("Failed to send message:", error.response?.data || error.message);
            } finally {
                // Acknowledge the message
                rabbitMQChannel.ack(msg);
            }
        }
    });
};

export default consumerToSend;
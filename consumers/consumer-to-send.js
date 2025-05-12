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
                const requestBody = {
                    messaging_product: "whatsapp",
                    to: messageContent.from
                };

                // Adiciona o conteúdo da mensagem baseado no tipo
                if (messageContent.content && messageContent.content.type) {
                    const contentType = messageContent.content.type;
                    requestBody.type = contentType;

                    // Adiciona os dados específicos de cada tipo de conteúdo
                    switch (contentType) {
                        case 'text':
                            requestBody.text = { body: messageContent.content.text };
                            break;
                        case 'image':
                            requestBody.image = messageContent.content.image;
                            break;
                        case 'audio':
                            requestBody.audio = messageContent.content.audio;
                            break;
                        case 'video':
                            requestBody.video = messageContent.content.video;
                            break;
                        case 'document':
                            requestBody.document = messageContent.content.document;
                            break;
                        default:
                            // Fallback para texto se o tipo não for suportado
                            requestBody.type = 'text';
                            requestBody.text = {
                                body: messageContent.content.text || 'Conteúdo não suportado'
                            };
                    }
                } else {
                    // Compatibilidade com versão anterior
                    requestBody.type = 'text';
                    requestBody.text = {
                        body: messageContent.text || 'Conteúdo não especificado'
                    };
                }

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

                rabbitMQChannel.ack(msg);
            } catch (error) {
                console.error("Failed to send message:", error.response?.data || error.message);
            }
        }
    });
};

export default consumerToSend;
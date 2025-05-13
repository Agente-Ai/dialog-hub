import axios from "axios";
import { saveOutgoingMessage } from "../services/messageService.js";

const consumerToSend = ({ rabbitMQChannel, GRAPH_API_TOKEN }) => {
    rabbitMQChannel.consume("messages.to_send", async (msg) => {
        if (msg == null) return;

        const messageContent = JSON.parse(msg.content.toString());

        try {
            const requestBody = {
                to: messageContent.from,
                type: messageContent.type,
                ...messageContent.content,
                messaging_product: "whatsapp",
            };

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

            console.log("Success send request message Meta");

            const { id } = response.data.messages[0];

            const savedOutgoingMessage = await saveOutgoingMessage({ ...messageContent, messageId: id });

            console.log("Message saved in database");

            rabbitMQChannel.ack(msg);
        } catch (error) {
            console.error("Failed to send message:", error.response?.data || error.message);
        }
    });
};

export default consumerToSend;
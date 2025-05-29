import axios from "axios";
import { saveOutgoingMessage } from "../services/messageService.js";

const consumerToSend = ({ rabbitMQChannel, GRAPH_API_TOKEN }) => {
    rabbitMQChannel.consume("messages.to_send", async (msg) => {
        if (msg == null) return;

        const messageContent = JSON.parse(msg.content.toString());
        const entries = messageContent.entry;
        const { id: whatsapp_business_account_id, changes } = entries[0];
        const change = changes[0];
        const value = change.value;
        const contacts = value.contacts;
        const contact = contacts[0];
        const { wa_id } = contact;
        const { phone_number_id, display_phone_number } = value.metadata;
        const content = messageContent.content;
        const type = Object.keys(content)[0];

        try {
            const requestBody = {
                type,
                to: wa_id,
                ...content,
                messaging_product: "whatsapp",
            };

            const response = await axios.post(
                `https://graph.facebook.com/v22.0/${phone_number_id}/messages`,
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

            const savedOutgoingMessage = await saveOutgoingMessage({
                content,
                from: wa_id,
                messageId: id,
                phone_number_id,
                display_phone_number,
                whatsapp_business_account_id,
                timestamp: Math.floor(Date.now() / 1000),
            });

            console.log("Message saved in database", savedOutgoingMessage);

            rabbitMQChannel.ack(msg);
        } catch (error) {
            console.error("Failed to send message:", error.response?.data || error.message);
        }
    });
};

export default consumerToSend;
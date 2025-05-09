export const createWebhookController = ({ }) => {
    const handleWebhookPost = async (req, res) => {
        const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

        console.log(message);

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
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {

    if (!configuration.apiKey) {
        res.status(500).json({
            error: {
                message: "OpenAI API key not configured, please follow instructions in README.md",
            },
        });
        return;
    }

    let conversation = req.body.conversation || "";
    const prompt = req.body.prompt || "";
    const user = req.body.user || "";

    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `
                Discuss the following topic: ${prompt}
                You are [${user}].
                Conversation History: ${conversation}
                [${user}]:
            `,
            temperature: 0.6,
            max_tokens: 150
        });
        res.status(200).json({ result: completion.data.choices[0].text });
    } catch (error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: "An error occurred during your request.",
                },
            });
        }
    }
}
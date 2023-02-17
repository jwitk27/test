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
    const question = req.body.question || "";
    conversation += 'Input: ' + question + '\n\n' + 'AI: ';

    if (question.trim().length === 0) {
        res.status(400).json({
            error: {
                message: "Please enter a valid question",
            },
        });
        return;
    }

    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `
                Use the conversation history to reference anything previously discussed with the user. Answer any new inputs to the best of your ability. Be polite and creative, provide insight, try to be accurate.
                Conversation History: ${conversation}
            `,
            temperature: 0.6,
            max_tokens: 150
        });
        conversation += 'AI: ' + completion.data.choices[0].text + '\n\n';
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

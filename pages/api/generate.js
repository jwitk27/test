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

    const question = req.body.question || "";
    const html = req.body.html || "";
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
      make this update to the original HTML:
      Update: ${question}
      Original HTML: ${html}
      Updated HTML: 
      note: only respond with updated HTML. If the original HTML is blank, just create new html for the Update request.
      `,
            temperature: 0.5,
            max_tokens: 2048,
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
const svg = document.querySelector("svg");
let x = 0;
function moveSVG() {
    svg.style.transform = `translateX(${x}px)`;
    x += 10;
    setTimeout(moveSVG, 100);
}
moveSVG();

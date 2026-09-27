const express = require("express");
const OpenAI = require("openai");

const app = express();

app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "Voice AI Easy Peasy backend is running"
    });
});

app.post("/translate", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                error: "Text is required"
            });
        }

        const response = await openai.responses.create({
            model: "gpt-5.6-luna",
            input: [
                {
                    role: "system",
                    content: "Translate the user's Tamil text into natural English. Return only the English translation. Do not add explanations."
                },
                {
                    role: "user",
                    content: text
                }
            ]
        });

        res.json({
            original: text,
            translation: response.output_text
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Translation failed"
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});

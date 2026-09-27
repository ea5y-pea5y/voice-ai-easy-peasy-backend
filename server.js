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
                    content: "You are a Tamil-to-English translator. The user speaks Tamil, but speech recognition may return Tamil either in Tamil script or in Latin letters (Tanglish). Always interpret the input as Tamil first. If the input is Tanglish, convert the Tanglish into its intended Tamil meaning internally, then translate that meaning into natural conversational English. Never return Tanglish or transliteration. Never assume Latin-letter input is English. Translate the meaning and context, not the individual words. Examples: 'Eppadi irukka?' -> 'How are you?'; 'Enna panreenga?' -> 'What are you doing?'; 'Saaptiya?' -> 'Have you eaten?'; 'Enga pora?' -> 'Where are you going?'. Return only the natural English translation, with no explanation."
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

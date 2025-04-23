require("dotenv").config();
import express from "express";
const { GoogleGenerativeAI } = require("@google/generative-ai");
import { GoogleGenAI } from "@google/genai";
import { BASE_PROMPT, getSystemPrompt } from "./prompt";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { basePrompt as reactBasePrompt } from "./defaults/react"
import { DEFAULT_CIPHERS } from "tls";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in the .env file.");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
// const ai = new GoogleGenerativeAI(GEMINI_API_KEY);
const cors = require('cors')
const app = express();
app.use(cors());
app.use(express.json());

app.post("/template", async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const prompt = req.body.prompt;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-001",
            contents: [
                // { role: "system", parts: [{ text: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra" }] },
        { role: "user", parts: [{ text: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra\n" + prompt }] },
     ],
        });
// const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-001" });

// const response = await model.generateContent({
//     contents: [
//         { role: "user", parts: [{ text: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra\n" + prompt }] },
//     ],
// });
console.log(response.candidates?.[0]?.content?.parts?.[0]?.text);
        // const answer = response.responseId.candidates[0]?.content?.parts[0]?.text.trim(); // react or node
        const answer = response.candidates?.[0]?.content?.parts?.[0]?.text;

        // if (answer != "react" && answer != "node") {
        //     res.status(403).json({message: "You can't access this"})
        //     return;
        // }

        if (answer == "react" || answer == "react\n") {
            res.json({
                prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [reactBasePrompt]
            })
            return;
        }
        if (answer === "node" || answer == "node\n") {
            res.json({
                // this needs to get forwaded to LLM
                prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                // this needs to be parsed by the UI, so that UI can start to build the initial project // the UI needs to see this and render all of these files in a web container.
                uiPrompts: [nodeBasePrompt]
            })
            return; 
        }
        res.status(403).json({ message: "You can't access this" })
        return;

    } catch (error) {
        console.error("Error:", error);
    }
})

app.post("/chat", async (req, res) => {
    try {
        const messages = req.body.messages;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-001",
            contents: [
                // { role: "system", parts: [{ text: getSystemPrompt() }] },
                // ...messages // Directly passing the user's messages array
                // { role: "user", parts: [{ text: `System Instruction: ${systemPrompt}\n\nUser Query: ${userMessage}` }] }
                { role: "user", parts: [{ text: getSystemPrompt() + "\n\n" + messages[0].parts[0].text }] }

            ],
        });

        const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || "No response received";
        console.log(responseText);

        res.json({ response: responseText });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});


app.listen(3000);

// // specific to javascript and typescript
// async function main() {
//     try {
//         const response = await ai.models.generateContentStream({
//             model: "gemini-2.0-flash-001",
//             contents: [{ role: "system", parts: [{ text: getSystemPrompt() }] },
//             { role: "user", parts: [{ text: BASE_PROMPT }] },
//             { role: "user", parts: [{ text: "Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${BASE_PROMPT}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n - .bolt/prompt" }] },
//             { role: "user", parts: [{ text: "Create a simple TODO app" }] },
//             ],
//         });

//         for await (const chunk of response) {
//             console.log(chunk.text);
//         }
//     } catch (error) {
//         console.error("Error:", error);
//     }
// }

// main();

// // specific to NodeJS
// async function main() {
//     try {

//         const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

//         const prompt = "Write the code for a TODO application";

//         const result = await model.generateContent(prompt);
//         console.log(result.response.text());
//     } catch (error) {
//         console.error("Error:", error);

//     }
// }

// main();

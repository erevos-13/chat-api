import OpenAI from "openai";

const openai = new OpenAI({
    organization: "org-dPVU4bli0X87IhJjqXswH3ye",
    apiKey: `${process.env.AI_API_KEY}`
});

export default openai;
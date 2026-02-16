import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, context } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: context,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.5,
    });

    const text = completion.choices[0].message.content;

    return res.status(200).json({ text });

  } catch (error) {
    console.error("Erro OpenAI:", error);
    return res.status(500).json({ error: "Erro na OpenAI" });
  }
}

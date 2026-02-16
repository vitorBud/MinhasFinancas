import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    console.log("API KEY EXISTS?", !!process.env.OPENAI_API_KEY);

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "API KEY NÃO ENCONTRADA" });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { message, context } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: context },
        { role: "user", content: message },
      ],
    });

    return res.status(200).json({
      text: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("ERRO REAL:", error);
    return res.status(500).json({
      error: error.message,
    });
  }
}

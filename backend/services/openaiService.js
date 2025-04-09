import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Checks if the query is study-related
export const isStudyRelated = async (message) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "Reply with 'yes' or 'no'. Is the following question study-related?" },
      { role: "user", content: message }
    ]
  });

  return response.choices[0].message.content.toLowerCase().includes('yes');
};

// Generates a reply for a study-related message
export const getStudyReply = async (message) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful study assistant. Only answer study-related queries in a concise and clear way." },
      { role: "user", content: message }
    ]
  });

  return response.choices[0].message.content;
};

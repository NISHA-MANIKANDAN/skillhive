import { isStudyRelated, getStudyReply } from '../services/openaiService.js';

export const handleChatRequest = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: 'No message received' });
  }

  try {
    const studyOnly = await isStudyRelated(message);

    if (!studyOnly) {
      return res.json({ reply: "Sorry, I only answer study-related questions. Please ask something academic!" });
    }

    const reply = await getStudyReply(message);
    res.json({ reply });

  } catch (error) {
    console.error('Chatbot error:', error.message);
    res.status(500).json({ reply: 'Something went wrong. Please try again later.' });
  }
};

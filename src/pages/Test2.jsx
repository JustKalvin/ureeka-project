import axios from "axios";
import { useState } from "react";

const Test = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  const askAI = async () => {
    try {
      const res = await axios.post("http://localhost:5678/webhook/test-doang", {
        question: question, // Pastikan "question" dikirim dalam body
      });
      console.log(res)
      setResponse(res.data.response);// Ambil respons dari AI
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Tanya AI</h2>
      <input 
        type="text" 
        value={question} 
        onChange={(e) => setQuestion(e.target.value)} 
        placeholder="Masukkan pertanyaan..." 
      />
      <button onClick={askAI}>Kirim</button>
      <p><strong>Jawaban:</strong> {response}</p>
    </div>
  );
};

export default Test;

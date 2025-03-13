import React, { useState } from "react";
import axios from "axios";
import { Card, Button, Form, InputGroup } from "react-bootstrap";

const ChatBox = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const submitQuestion = async () => {
    if (!userInput) {
      alert("Masukkan pertanyaan terlebih dahulu.");
      return;
    }

    // Tampilkan pertanyaan pengguna
    setChatHistory([...chatHistory, { role: "user", text: userInput }]);

    let schoolData = [];
    try {
      const response = await axios.get("http://127.0.0.1:8000/datasekolah");
      schoolData = response.data;
    } catch (error) {
      console.error("Error fetching school data:", error);
      alert("Gagal mengambil data sekolah, coba lagi nanti.");
      return;
    }

    const apiKey = "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";
    const apiUrl = "https://api.groq.com/openai/v1/chat/completions";

    const requestBody = {
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: `Anda adalah asisten AI yang menjawab pertanyaan tentang database sekolah. Gunakan informasi dalam data berikut untuk menjawab dengan detail.`,
        },
        {
          role: "user",
          content: `Berikut adalah database sekolah: ${JSON.stringify(schoolData)}. ${userInput}`,
        },
      ],
      temperature: 0.5,
    };

    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      });

      const answer = response.data.choices[0].message.content.trim();

      // Tampilkan jawaban AI
      setChatHistory([...chatHistory, { role: "user", text: userInput }, { role: "ai", text: answer }]);
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan, coba lagi nanti.");
    }

    setUserInput("");
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Card className="shadow p-4 w-50">
        <Card.Body>
          <div className="chat-box mb-3">
            {chatHistory.map((message, index) => (
              <div key={index} className={`chat-message ${message.role}`}>
                <strong>{message.role === "user" ? "Anda: " : "AI: "}</strong>
                {message.text}
              </div>
            ))}
          </div>

          {/* Input & Button */}
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="Tanyakan sesuatu tentang sekolah..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <Button variant="primary" onClick={submitQuestion}>
              Kirim
            </Button>
          </InputGroup>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChatBox;

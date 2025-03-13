import React, { useState, useEffect, useRef } from "react";

function Chatbot({ userData }) {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Sebentar, saya sedang menganalisis kebutuhan nutrisimu..." }
  ]);
  
  const hasRequested = useRef(false); // Gunakan useRef agar tidak menyebabkan re-render

  useEffect(() => {
    if (!hasRequested.current && userData?.gender && userData?.age && userData?.profession) {
      hasRequested.current = true; // Set menjadi true sebelum memanggil API
      getBotResponse();
    }
  }, [userData]); // Pastikan hanya bergantung pada userData

  const getBotResponse = async () => {
    const prompt = `Jawablah dalam bahasa Indonesia. Seorang ${userData.gender} berusia ${userData.age} tahun dengan profesi ${userData.profession} membutuhkan makanan bergizi gratis. Berikan rekomendasi makanan yang sesuai berdasarkan data pribadi mereka, serta jelaskan mengapa makanan tersebut cocok untuk mereka.`;

    const apiKey = "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";
    const apiUrl = "https://api.groq.com/openai/v1/chat/completions";

    const requestBody = {
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "Anda adalah seorang ahli gizi yang memberikan rekomendasi makanan bergizi kepada pengguna berdasarkan data pribadi mereka." },
        { role: "user", content: prompt },
      ],
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = data.choices?.[0]?.message?.content || "Maaf, saya tidak bisa merespons saat ini.";

      setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: botMessage }]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: "Maaf, terjadi kesalahan. Coba lagi nanti." }]);
    }
  };

  return (
    <div className="card shadow-lg p-3 mt-4 w-50">
      <h4 className="text-center mb-3">Asisten Ahli Gizi</h4>
      <div id="chatbot-messages" className="border p-3 mb-3 bg-light" style={{ height: "200px", overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <div key={index} className={`alert ${msg.sender === "bot" ? "alert-secondary text-start" : "alert-primary text-end"}`}>
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chatbot;

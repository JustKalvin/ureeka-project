import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Card, Button, Form, InputGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { motion } from "framer-motion";


const ChatBox = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    chatContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatHistory]);

  const submitQuestion = async () => {
    if (!userInput.trim()) return;
  
    // Langsung update chatHistory dengan callback function
    setChatHistory((prevChat) => [...prevChat, { role: "user", text: userInput }]);
  
    let schoolData = [];
    try {
      const response = await axios.get("http://127.0.0.1:8000/datasekolah");
      schoolData = response.data;
    } catch (error) {
      console.error("Error fetching school data:", error);
      setChatHistory((prevChat) => [
        ...prevChat,
        { role: "ai", text: "Gagal mengambil data sekolah, coba lagi nanti." }
      ]);
      return;
    }
  
    const apiKey = "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";
    const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
  
    const requestBody = {
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "Anda adalah asisten AI yang menjawab pertanyaan tentang database sekolah." },
        { role: "user", content: `Berikut database sekolah: ${JSON.stringify(schoolData)}. ${userInput}` },
      ],
      temperature: 0.5,
    };
  
    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      });
  
      const answer = response.data.choices[0].message.content.trim();
      
      // Gunakan callback untuk memastikan update berdasarkan state terbaru
      setChatHistory((prevChat) => [
        ...prevChat,
        { role: "ai", text: answer }
      ]);
    } catch (error) {
      console.error("Error:", error);
      setChatHistory((prevChat) => [
        ...prevChat,
        { role: "ai", text: "Terjadi kesalahan, coba lagi nanti." }
      ]);
    }
  
    setUserInput("");
  };
  

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor : "#fcecdf"}}>
      <Navbar selectedPage = "help"/>
      <motion.div 
        className="ms-4 fw-bold fs-4"
        initial={{ opacity: 0, x: -50 }}  // Mulai dari transparan dan turun 50px
        animate={{ opacity: 1, x: 0 }}   // Muncul dan naik ke posisi semula
        transition={{ duration: 0.8 }}
      >
        <p className="zilla-slab-bold fs-1">Tanyakan Kendala-mu<br />Ke Asisten Pintar!</p>
      </motion.div>
      <motion.div 
        className="mx-auto d-block mt-5 pt-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="fw-bold fs-1 zilla-slab-bold">🤖 Asisten Pintar</p>
      </motion.div>
      <motion.div 
        style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center"}}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card style={{ width: "60%", maxWidth: "600px" }} className="shadow">
          <Card.Body>
            <div style={{ maxHeight: "400px", overflowY: "auto", padding: "10px", borderRadius: "5px", backgroundColor: "#f8f9fa" }} ref={chatContainerRef}>
              {chatHistory.map((msg, index) => (
                <div key={index} style={{
                  margin: "10px 0", padding: "10px", borderRadius: "10px", maxWidth: "80%",
                  backgroundColor: msg.role === "user" ? "#ee6a43" : "#e9ecef", color: msg.role === "user" ? "white" : "black",
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  textAlign: msg.role === "user" ? "right" : "left"
                }}>
                  <strong>{msg.role === "user" ? "Anda" : "AI"}</strong>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
            <InputGroup style={{ marginTop: "10px" }}>
              <Form.Control
                className="barlow"
                type="text"
                placeholder="Tanyakan sesuatu tentang sekolah..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                style={{
                  borderColor: "#fcecdf",
                  boxShadow: "0 0 5px #fcecdf",
                  transition: "box-shadow 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.boxShadow = "0 0 10px #f99d90")}
                onBlur={(e) => (e.target.style.boxShadow = "0 0 5px #f99d90")}
              />
              <Button style={{backgroundColor: "#9e122c", border : "2px solid", borderColor : "#9e122c", zIndex : 10}} onMouseEnter={(e) => (e.target.style.transform = "scale(1.1")} onMouseLeave={(e) => (e.target.style.transform = "scale(1")} onClick={() => submitQuestion()}>Kirim</Button>
            </InputGroup>
          </Card.Body>
        </Card>
      </motion.div>
      <div className="ms-4 mt-6 pt-5" style={{marginTop : "200px"}}>
        <p className="zilla-slab-bold fs-2">Untuk Bantuan Lebih Lanjut, <br />Hubungi Kami : </p>
        <p className="zilla-slab" style={{fontWeight : 500, color : "#9e122c"}}>Email: support@gizikita.com</p>
        <p className="zilla-slab" style={{fontWeight : 500, color : "#9e122c"}}>Nomor Telepon: 0812-3456-7890</p>
        <p className="zilla-slab" style={{fontWeight : 500, color : "#9e122c"}}>Alamat Kami: Jl. Merdeka No. 123, Kel. Sukajaya, Kec. Harmoni, <br />Jakarta Pusat, DKI Jakarta 10110, Indonesia.</p>
      </div>
      <Footer />
    </div>
  );
};

export default ChatBox;

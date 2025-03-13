import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion"; // ✅ Import Framer Motion
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

function Feedback() {
  const [selectedButton, setSelectedButton] = useState("0")
  const [feedback, setFeedback] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [tempFeedbackList, setTempFeedbackList] = useState([])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Memuat feedback dari server saat halaman dibuka
  useEffect(() => {
    const fetchingAPI = async () => {
      const response = await fetch("http://127.0.0.1:8000/get-feedbacks")
      const data = await response.json()
      setFeedbackList(feedbackList => (data))
      setTempFeedbackList(tempFeedbackList => (data))
      console.log(data)
    }
    fetchingAPI()
  }, [])
  // useEffect(() => {
  //   fetch("http://127.0.0.1:8000/get-feedbacks")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setFeedbackList(data.feedbacks || []);
  //       setTempFeedbackList(data.feedbacks || []);
  //       console.log(`data : ${data.feedbacks}`)
  //     })
  //     .catch((error) => console.error("Error:", error));
  // }, []);

  const submitFeedback = async () => {
    if (!feedback) return alert("Masukkan feedback terlebih dahulu.");

    try {
      const apiKey = "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";
      const apiUrl = "https://api.groq.com/openai/v1/chat/completions";

      const requestBody = {
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "Anda adalah AI yang mengklasifikasikan ulasan makanan ke dalam kategori 'Positif', 'Netral', atau 'Negatif'. Ingat! Jawabannya hanya 'Positif', 'Netral', atau 'Negatif'."},
          { role: "user", content: `Classify the following review: "${feedback}"` }
        ],
        temperature: 0.5
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error("Gagal mendapatkan respons dari server");

      const result = await response.json();
      const sentiment = result.choices[0].message.content.trim();
      let sentimentEmoji = sentiment.includes("Positif") ? "🙂" : sentiment.includes("Netral") ? "🫥" : "☹️";
      const profile = JSON.parse(localStorage.getItem("user_login"))
      const name = profile.given_name

      // Kirim feedback ke backend
      const feedbackData = {name: name, text: feedback, sentiment, emoji: sentimentEmoji, time : new Date().toISOString(), isDone : false};
      await fetch("http://127.0.0.1:8000/feedbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(feedbackData)
      });

      // Perbarui daftar feedback di frontend
      setFeedbackList([...feedbackList, feedbackData]);
      setFeedback(""); // Reset input
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan, coba lagi nanti.");
    }
  };

  const handleFilter = (currSelection) => {
    if(currSelection === selectedButton) {
      setFeedbackList(feedbackList => (tempFeedbackList))
      setSelectedButton("0")
    }
    else {
      setSelectedButton(currSelection)
      if(currSelection === "1") {
        const sortedList = [...tempFeedbackList].sort((a, b) => new Date(a.time) - new Date(b.time));
        setFeedbackList(sortedList)
      }
      if(currSelection === "2") {
        const sortedList = [...tempFeedbackList].sort((a, b) => new Date(b.time) - new Date(a.time));
        setFeedbackList(sortedList)
      }
      if(currSelection === "3") {
        const isDoneFalse = tempFeedbackList.filter((item, index) => item.isDone === false)
        setFeedbackList(isDoneFalse)
      }
      if(currSelection === "4") {
        const isDoneTrue = tempFeedbackList.filter((item, index) => item.isDone === true)
        setFeedbackList(isDoneTrue)
      }
    }
  };

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{ backgroundColor: "#fcecdf" }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Navbar style={{ backgroundColor: "#fbcb77" }} selectedPage = "feedback"/>

      <motion.div 
        className="mx-5 mt-4 mb-4"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <p className="fw-bold fs-1 zilla-slab-bold">
          Yuk, Intip Umpan Balik <br />Makanan Minggu Ini!
        </p>
      </motion.div>

      <div className="container pt-5 mt-5">
        <div className="row justify-content-center">
          <motion.div 
            className="col-md-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="card shadow-sm p-4">
              <motion.h2 
                className="text-center zilla-slab"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{fontWeight : 600}}
              >
                Berikan Feedback Anda
              </motion.h2>
              
              <textarea
                className="form-control my-3 barlow"
                rows="3"
                placeholder="Tulis feedback Anda di sini..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              ></textarea>

              <motion.button
                className="btn btn-primary d-block mx-auto w-50"
                onClick={submitFeedback}
                style={{
                  backgroundColor: "#FFD9CC",
                  borderRadius: "10px",
                  border: "2px solid #f99d90",
                }}
                whileHover={{ scale: 1.05, backgroundColor: "#f99d90" }}
                whileTap={{ scale: 0.95 }}
              >
                Kirim
              </motion.button>
            </div>
          </motion.div>
        </div>
        <div className="mt-5 pt-5">
          <p className="fw-bold fs-2 zilla-slab-bold">Filter & Sortir</p>
          <div>
            {selectedButton === "1" ? <button onClick={() => handleFilter("1")} className="mx-3 zilla-slab" style={{color : "white", border : "2px solid #9E122C", borderRadius : "15px", backgroundColor : "#9E122C", fontWeight : 500}}>Paling Awal</button> : <button onClick={() => handleFilter("1")} className="mx-3 bg-transparent zilla-slab" style={{color : "#9E122C", border : "2px solid #9E122C", borderRadius : "15px", fontWeight : 500}}>Paling Awal</button>}
            {selectedButton === "2" ? <button onClick={() => handleFilter("2")} className="mx-3 zilla-slab" style={{color : "white", border : "2px solid #9E122C", borderRadius : "15px", backgroundColor : "#9E122C", fontWeight : 500}}>Paling Baru</button> : <button onClick={() => handleFilter("2")} className="mx-3 bg-transparent zilla-slab" style={{color : "#9E122C", border : "2px solid #9E122C", borderRadius : "15px", fontWeight : 500}}>Paling Baru</button>}
            {selectedButton === "3" ? <button onClick={() => handleFilter("3")} className="mx-3 zilla-slab" style={{color : "white", border : "2px solid #9E122C", borderRadius : "15px", backgroundColor : "#9E122C", fontWeight : 500}}>Belum Ditangani</button> : <button onClick={() => handleFilter("3")} className="mx-3 bg-transparent zilla-slab" style={{color : "#9E122C", border : "2px solid #9E122C", borderRadius : "15px", fontWeight : 500}}>Belum Ditangani</button>}
            {selectedButton === "4" ? <button onClick={() => handleFilter("4")} className="mx-3 zilla-slab" style={{color : "white", border : "2px solid #9E122C", borderRadius : "15px", backgroundColor : "#9E122C", fontWeight : 500}}>Sudah Ditangani</button> : <button onClick={() => handleFilter("4")} className="mx-3 bg-transparent zilla-slab" style={{color : "#9E122C", border : "2px solid #9E122C", borderRadius : "15px", fontWeight : 500}}>Sudah Ditangani</button>}
            {/* <button onClick={() => handleFilter("2")} className="mx-3 bg-transparent " style={{color : "#9E122C", border : "2px solid #9E122C", borderRadius : "15px"}}>Paling Awal</button>
            <button onClick={() => handleFilter("3")} className="mx-3 bg-transparent " style={{color : "#9E122C", border : "2px solid #9E122C", borderRadius : "15px"}}>Sudah Ditangani</button>
            <button onClick={() => handleFilter("4")} className="mx-3 bg-transparent " style={{color : "#9E122C", border : "2px solid #9E122C", borderRadius : "15px"}}>Belum Ditangani</button> */}
          </div>
        </div>
        <div className="row justify-content-center mt-4">
          <motion.div 
            className="col-md-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="card shadow-sm p-4 bg-transparent border-0">
              <motion.h2 
                className="text-center zilla-slab-bold"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Daftar Feedback
              </motion.h2>
              {feedbackList.map((item, index) => (
                <motion.div
                  key={index}
                  className="p-3 my-2 rounded shadow-sm"
                  style={{ backgroundColor: "#FFD9CC", borderRadius: "10px", border: "3px solid #ee6a43" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <p className="h4 fw-bold">{item.name}</p>
                  <p className="mb-1">{item.text}</p>
                  <small className="text-muted mb-5">{item.sentiment} {item.emoji}</small>
                  <p className="mt-4">Posted : {new Date(item.time).toString()}</p>
                  {item.isDone === true ? <p>Status : Sudah Ditangani</p> : <p>Status : Belum Ditangani</p>}
                  
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer className="mt-auto text-center p-3 bg-dark text-white" />
    </div>
  );
}

export default Feedback;

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "animate.css";
import { motion } from "framer-motion";
import "../index.css"

function MenuMakanan() {
  const [menu, setMenu] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedManfaat, setSelectedManfaat] = useState(""); // Simpan manfaat dari AI

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    const fetchAPI = async () => {
      const response = await fetch("http://127.0.0.1:8000/menumakanan");
      const data = await response.json();
      setMenu(data);
    };
    fetchAPI();
  }, []);

  // Fungsi untuk memanggil AI Model agar menjelaskan manfaat makanan
  const fetchManfaatAI = async (item) => {
    const prompt = `Jelaskan manfaat dari makanan berikut dalam bahasa Indonesia:\n\n${item.karbohidrat}, ${item.lauk}, ${item.buah}, ${item.sayur}. Jelaskan menu per menu!`;

    const apiKey = "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";
    const apiUrl = "https://api.groq.com/openai/v1/chat/completions";

    const requestBody = {
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "Anda adalah seorang ahli gizi yang memberikan informasi manfaat dari makanan." },
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
      const manfaatText = data.choices?.[0]?.message?.content || "Maaf, saya tidak dapat menemukan manfaat saat ini.";
      setSelectedManfaat(manfaatText);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setSelectedManfaat("Terjadi kesalahan, silakan coba lagi nanti.");
    }
  };

  // Handle klik pada card
  const handleClick = (index, item) => {
    setSelectedMenu(item); // Simpan menu yang diklik
    setSelectedManfaat("Sedang mengambil data manfaat..."); // Placeholder sebelum respons AI datang
    fetchManfaatAI(item);
  };

  // Handle menutup modal
  const closeModal = () => {
    setSelectedMenu(null);
    setSelectedManfaat("");
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: "#fcecdf" }}>
      <Navbar selectedPage = "menu"/>
      <motion.h2 
        className="text-start mx-5 my-5 zilla-slab-bold fs"
        initial={{ opacity: 0, x: -50 }}  // Mulai dari transparan dan turun 50px
        animate={{ opacity: 1, x: 0 }}   // Muncul dan naik ke posisi semula
        transition={{ duration: 0.8 }}   // Efek transisi selama 0.8 detik
      >
        Intip Menu Makanan Sehat <br /> Minggu Ini!
      </motion.h2>


      <div className="container">
      <div className="row justify-content-center">
        {menu.map((item, index) => (
          <motion.div
            key={index} // Tambahkan key agar tidak ada warning di React
            className="col-lg-3 col-md-4 col-sm-6 mb-4"
            whileHover={{ scale: 1.05, boxShadow: "0 8px 16px rgba(0,0,0,0.2)" }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div 
              className="card text-center"
              style={{ cursor: "pointer", border: "3px solid #f99d90", borderRadius: "5px" }}
              onClick={() => handleClick(index, item)}
            >
              <img src={`http://127.0.0.1:8000/imagegrids/${item.imgurl}`} alt="" />
              <div 
                className="card-body"
                style={{
                  backgroundColor: "#FFD9CC",
                  border: "3px solid #f99d90",
                  borderRadius: "5px",
                }}
              >
                <h5 className="card-title zilla-slab-bold" style={{color : "#9e122c"}}>{item.hari}</h5>
                <p className="barlow-" style={{fontWeight : 500}}>Karbohidrat : {item.karbohidrat}</p>
                <p className="barlow-" style={{fontWeight : 500}}>Lauk : {item.lauk}</p>
                <p className="barlow-" style={{fontWeight : 500}}>Buah : {item.buah}</p>
                <p className="barlow-" style={{fontWeight : 500}}>Sayur : {item.sayur}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      </div>

      <Footer />

      {/* Modal Bootstrap untuk Menampilkan Manfaat di Tengah Layar */}
      {selectedMenu && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content" style={{width : "2000px", backgroundColor : "#fcecdf"}}>
              <div className="modal-header">
                <h5 className="modal-title">Manfaat Menu {selectedMenu.hari}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <h5 className="card-title">{selectedMenu.hari}</h5>
                <p className="my-1">Karbohidrat : {selectedMenu.karbohidrat}</p>
                <p className="my-1">Lauk : {selectedMenu.lauk}</p>
                <p className="my-1">Buah : {selectedMenu.buah}</p>
                <p className="mt-1 mb-5">Sayur : {selectedMenu.sayur}</p>
                <h6>Manfaat:</h6>
                <p className="my-1">{selectedManfaat}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={closeModal}>Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuMakanan;

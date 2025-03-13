import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import FooterBg2 from "../assets/FooterBg2.png";
import HomeBg from "../assets/HomeBg.png";
import LogoMakanan from "../assets/LogoMakanan.png";
import {useState, useEffect} from "react"
import HomeBg2 from "../assets/bghome2.png"
import HomeBg3 from "../assets/bghome3.png"
import BubbleChat from "../assets/bubblechat.png"
import Distribution from "../assets/distribusi.png"
import { useNavigate } from "react-router-dom";
import {motion} from "framer-motion"

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100 position-relative" style={{backgroundColor: "#fcecdf" }}>
      {/* Navbar */}
      <Navbar className="sticky-top" selectedPage = "home"/>
      {/* Konten Utama */}
      <main className="flex-grow-1 position-relative" style={{ height: "3200px"}}>
        {/* Background Image sebagai wrapper */}
        <div
          className="position-relative w-100"
          style={{
            backgroundImage: `url(${HomeBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "100vh",
            zIndex : 1
          }}
        >
          {/* Overlay untuk meningkatkan keterbacaan teks */}
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}></div>

          {/* Teks di atas gambar */}
          <div className="container position-absolute top-50 start-0 translate-middle-y text-white text-start ms-5">
            <h1 style={{ fontSize: "3.5rem", fontWeight: "bold", fontFamily: "Georgia, serif" }}>
              Selamat Datang!
            </h1>
            <p style={{ fontSize: "1.2rem", fontFamily: "Arial, sans-serif", textAlign: "left", maxWidth: "600px" }}>
              Setiap anak Indonesia berhak mendapatkan makanan bergizi melalui sistem yang transparan dan efisien. 
              Dengan sistem ini, pendaftaran sekolah menjadi lebih mudah, distribusi makanan lebih merata, 
              serta umpan balik dari masyarakat dapat digunakan untuk terus meningkatkan kualitas program.
            </p>
          </div>
        </div>
        
        {/* Section Registrasi */}
        <div className="py-3" style={{ backgroundColor: "#fcecdf"}}></div> 
        <div className="py-3" style={{ backgroundColor: "#FBCB77"}}></div>
        <section
          className="text-center py-5 d-flex justify-content-center align-items-center"
          style={{
            backgroundImage: `url(${HomeBg2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            color: "white",
            textShadow: "1px 1px 5px rgba(0, 0, 0, 0.7)",
            minHeight : "100vh"
          }}
        >
          <div className="container ">
            <p className="zilla-slab h1 text-dark">
              Pendataan Sekolah Lebih Cepat & Akurat!
            </p>
            <p className="zilla-slab h4 text-dark">
              Proses pendaftaran sekolah penerima program Makan Bergizi Gratis kini lebih mudah!
            </p>
            <motion.button
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => navigate("/Registrasi")}
                className="btn mt-3 zilla-slab-semi-bold text-white"
                style={{ backgroundColor: "#9e122c" }}
              >
                Kelola Pendaftaran Sekolah
            </motion.button>
          </div>
        </section>
        <div className="py-3" style={{ backgroundColor: "#FBCB77" }}></div> 
        <div className="py-3" style={{ backgroundColor: "#F99D90" }}></div>

        {/* Section: Menu Sehat */}
        <section
          className="text-center py-5 d-flex justify-content-center align-items-center"
          style={{
            backgroundImage: `url(${HomeBg3})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            color: "white",
            textShadow: "1px 1px 5px rgba(0, 0, 0, 0.7)",
            minHeight : "100vh"
          }}
        >
          <div className="container ">
            <h2 className="fw-bold">Menu Sehat untuk Semua Sekolah!</h2>
            <p className="lead zilla-slab">
              Lihat daftar menu mingguan dan pastikan setiap anak mendapatkan asupan gizi seimbang.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => navigate("/MenuMakanan")}
              className="btn mt-3 zilla-slab-semi-bold text-white"
              style={{ backgroundColor: "#9e122c" }}
            >
              Lihat Menu Mingguan
            </motion.button>
          </div>
        </section>

        {/* Section: Distribusi */}
        <section className="py-5">
          <div className="container-fluid"> {/* Ubah jadi container-fluid */}
            <div className="row align-items-center">
              {/* Kolom gambar */}
              <div className="col-md-6 d-flex justify-content-start p-0"> {/* Tambahkan justify-content-start */}
                <img
                  src={Distribution}
                  alt="Distribusi"
                  className="img-fluid rounded"
                />
              </div>
              
              {/* Kolom teks & tombol */}
              <div className="col-md-6 text-center d-flex flex-column justify-content-center align-items-center">
                <h2 className="zilla-slab-bold text-dark">Pantau & Atur Distribusi</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => navigate("/Feedback")}
                  className="btn mt-3 zilla-slab-semi-bold text-white w-50"
                  style={{ backgroundColor: "#9e122c", borderRadius: "20px" }}
                >
                  Kelola Laporan Distribusi
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => navigate("/CustomerSupport")}
                  className="btn mt-3 zilla-slab-semi-bold text-white w-50"
                  style={{ backgroundColor: "#9e122c", borderRadius: "20px" }}
                >
                  Cek Sekolah Terdaftar
                </motion.button>
              </div>
            </div>
          </div>
        </section>


        {/* Section: Feedback */}
        <section className="py-5 d-flex">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6 text-center">
                <h2 className="zilla-slab-bold">Dengar Suara Masyarakat!</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => navigate("/Feedback")}
                  className="btn mt-3 zilla-slab-semi-bold text-white w-50"
                  style={{ backgroundColor: "#9e122c" , borderRadius : "20px"}}
                >
                  Lihat Umpan Balik
                </motion.button>
              </div>
              <div className="col-md-6">
                <img
                  src={BubbleChat}
                  alt="Bubble Chat"
                  className="img-fluid rounded"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  );
};
    

export default Home;



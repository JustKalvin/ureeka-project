import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

function Laporan() {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    deskripsi: "",
    bukti: [],
  });

  const [previews, setPreviews] = useState([]);
  const [message, setMessage] = useState(null);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Handler untuk input teks
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler untuk upload banyak file
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, bukti: files });

    // Buat preview untuk setiap file yang diunggah
    const filePreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setPreviews(filePreviews);
  };

  // Handler untuk submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.nama || !formData.email || !formData.deskripsi) {
      setMessage({ type: "danger", text: "Semua bidang harus diisi!" });
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append("nama", formData.nama);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("deskripsi", formData.deskripsi);
  
    formData.bukti.forEach((file) => {
      formDataToSend.append("bukti", file); // Nama "bukti" tidak perlu pakai []
    });
  
    console.log("Mengirim data:", formDataToSend);
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/laporan", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      console.log("Response dari server:", response.data);
  
      if (response.status === 200 || response.status === 201) {
        setMessage({ type: "success", text: "Laporan berhasil dikirim!" });
        setFormData({ nama: "", email: "", deskripsi: "", bukti: [] });
        setPreviews([]);
      }
    } catch (error) {
      console.error("Error saat mengirim laporan:", error.response || error);
      setMessage({ type: "danger", text: "Gagal mengirim laporan!" });
    }
  };
  

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <h2 className="text-center mb-4">Form Laporan Keluhan</h2>

      {message && (
        <div className={`alert alert-${message.type}`} role="alert">
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="shadow p-4 bg-light rounded">
        {/* Nama Pelapor */}
        <div className="mb-3">
          <label className="form-label">Nama Pelapor</label>
          <input type="text" name="nama" className="form-control" value={formData.nama} onChange={handleChange} required />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
        </div>

        {/* Deskripsi Laporan */}
        <div className="mb-3">
          <label className="form-label">Deskripsi Laporan</label>
          <textarea name="deskripsi" className="form-control" rows="4" value={formData.deskripsi} onChange={handleChange} required></textarea>
        </div>

        {/* Upload Bukti */}
        <div className="mb-3">
          <label className="form-label">Upload Bukti (Gambar/Video, Opsional)</label>
          <input type="file" className="form-control" accept="image/*,video/*" multiple onChange={handleFileChange} />
        </div>

        {/* Preview File */}
        {previews.length > 0 && (
          <div className="mb-3">
            <label className="form-label">Preview Bukti</label>
            <div className="d-flex flex-wrap gap-2">
              {previews.map((file, index) => (
                file.type.startsWith("image") ? (
                  <img key={index} src={file.url} alt="Preview" className="img-thumbnail" style={{ maxWidth: "150px" }} />
                ) : (
                  <video key={index} controls width="150">
                    <source src={file.url} type={file.type} />
                    Browser Anda tidak mendukung pemutaran video.
                  </video>
                )
              ))}
            </div>
          </div>
        )}

        {/* Tombol Submit */}
        <button type="submit" className="btn btn-primary w-100">Kirim Laporan</button>
      </form>
      <Footer />
    </div>
  );
}

export default Laporan;

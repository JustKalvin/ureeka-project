import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [showContent, setShowContent] = useState(false); // State untuk delay animasi
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0);

    // Tunggu 500ms sebelum menampilkan konten (atur sesuai kebutuhan)
    setTimeout(() => {
     setShowContent(true)
     setIsLoading(false)
    }, 500);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user_login");
    if (storedUser) {
      return setUser(JSON.parse(storedUser));
    }

    fetch("http://localhost:8000/user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          console.log(data);
          setUser(data);
          localStorage.setItem("user_login", JSON.stringify(data));
          setMessage("✅ Login Berhasil! Selamat datang " + data.name);
          setTimeout(() => setMessage(""), 3000);
        }
      });
  }, []);

  const handleLogin = () => {
    window.location.href = "http://localhost:8000/login";
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/logout", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("user_login");
        setUser(null);
        window.location.href = "http://localhost:5173/Profile";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: "#fcecdf" }}>
      <Navbar selectedPage="profile" />
      <div className="container d-flex flex-column justify-content-center align-items-center flex-grow-1 mt-5 pt-5">
        
        {message && (
          <motion.div
            className="alert alert-success w-100 text-center"
            role="alert"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {message}
          </motion.div>
        )}
        {/* {isLoading ? <p className="fs-3 zilla-slab-bold">Loading...</p> : <p> </p>} */}
        <p className="fs-3 zilla-slab-bold">{isLoading ? "Loading..." : ""}</p>
        <AnimatePresence>
          {showContent && ( // Konten baru muncul setelah delay
            user ? (
              <motion.div
                key="user-card"
                className="card shadow p-4 text-center"
                style={{ maxWidth: "400px" }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="fw-bold zilla-slab-bold">Welcome, {user.name}!</h2>
                <div
                  className="rounded-circle mt-3 shadow mx-auto d-block"
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundImage: `url(${user?.picture || "https://via.placeholder.com/80"})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "50%",
                  }}
                ></div>

                <motion.button
                  onClick={handleLogout}
                  className="btn btn-danger mt-4 w-100 fw-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="login-card"
                className="card shadow p-4 text-center"
                style={{ maxWidth: "400px" }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="fw-bold zilla-slab-bold">Sign in</h2>
                <p className="text-muted barlow">Access your account securely</p>
                <motion.button
                  onClick={handleLogin}
                  className="btn btn-primary w-100 fw-bold shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="bi bi-google me-2"></i> Sign in with Google
                </motion.button>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;

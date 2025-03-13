import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Logo from "../assets/Logo.png";
import "./Navbar.css"; // Import CSS di folder yang sama
import { useState } from "react";

function Navbar(props) {

  return (
    <nav className="navbar navbar-expand sticky-top navbar-custom">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav d-flex justify-content-around align-items-center w-100">
            <li className="nav-item">
              <Link  
                className={`nav-link ${props.selectedPage === "home" ? "active-link" : ""}`} 
                to="/"
              >
                Beranda
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${props.selectedPage === "register" ? "active-link" : ""}`} 
                to="/Registrasi"
              >
                Registrasi
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${props.selectedPage === "menu" ? "active-link" : ""}`} to="/MenuMakanan">Menu Makanan</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <img 
                  src={Logo} 
                  alt="Logo" 
                  className="nav-logo"
                />
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${props.selectedPage === "feedback" ? "active-link" : ""}`} to="/Feedback">Umpan Balik</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${props.selectedPage === "help" ? "active-link" : ""}`} to="/CustomerSupport">Bantuan</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${props.selectedPage === "profile" ? "active-link" : ""}`} to="/Profile">Profile</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

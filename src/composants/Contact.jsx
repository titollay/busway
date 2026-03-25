import React from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebook, FaTwitter } from "react-icons/fa";

const Contact = () => {
  return (
    <div
      className="contact-container"
      style={{
        padding: "3rem",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        background: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#007bff", marginBottom: "1rem" }}>Contactez-nous</h1>
      <p style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
        Pour toute question ou information sur <strong>BusFink</strong>, vous pouvez nous contacter via :
      </p>

      <div
        className="contact-info"
        style={{
          display: "inline-block",
          textAlign: "left",
          background: "#fff",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          animation: "fadeIn 1s ease-in-out",
          minWidth: "300px",
        }}
      >
        <p style={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}>
          <FaMapMarkerAlt style={{ marginRight: "0.8rem", color: "#007bff" }} />
          <strong>Adresse :</strong> 123 Rue des Bus, Oujda, Maroc
        </p>
        <p style={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}>
          <FaEnvelope style={{ marginRight: "0.8rem", color: "#007bff" }} />
          <strong>Email :</strong> contact@busfink.com
        </p>
        <p style={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}>
          <FaPhone style={{ marginRight: "0.8rem", color: "#007bff" }} />
          <strong>Téléphone :</strong> +212 7 28 57 97
        </p>
        <p style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <strong>Suivez-nous :</strong>
          <a href="#" style={{ color: "#007bff", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <FaFacebook /> Facebook
          </a>
          <a href="#" style={{ color: "#007bff", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <FaTwitter /> Twitter
          </a>
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          0% {opacity: 0; transform: translateY(20px);}
          100% {opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
};

export default Contact;
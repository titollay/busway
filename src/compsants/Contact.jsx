import React from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebook, FaTwitter } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-10 text-center font-sans">
      
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Contactez-nous
      </h1>

      <p className="text-lg mb-8">
        Pour toute question ou information sur <strong>BusFink</strong>, vous pouvez nous contacter via :
      </p>

      <div className="bg-white p-8 rounded-xl shadow-lg animate-fadeIn min-w-[300px] text-left">
        
        <p className="flex items-center mb-4">
          <FaMapMarkerAlt className="mr-3 text-blue-600" />
          <strong>Adresse :</strong>&nbsp; 123 Rue des Bus, Oujda, Maroc
        </p>

        <p className="flex items-center mb-4">
          <FaEnvelope className="mr-3 text-blue-600" />
          <strong>Email :</strong>&nbsp; contact@busfink.com
        </p>

        <p className="flex items-center mb-4">
          <FaPhone className="mr-3 text-blue-600" />
          <strong>Téléphone :</strong>&nbsp; +212 7 28 57 97
        </p>

        <p className="flex items-center gap-4">
          <strong>Suivez-nous :</strong>

          <a href="#" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition">
            <FaFacebook /> Facebook
          </a>

          <a href="#" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition">
            <FaTwitter /> Twitter
          </a>
        </p>
      </div>
    </div>
  );
};

export default Contact;

import React from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebook, FaTwitter } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="relative min-h-[120vh] flex items-start justify-center pt-32 pb-20 px-6 font-sans overflow-hidden bg-[#07041B]">
      
      {/* Background غامق */}
      <div className="absolute inset-0 bg-[#070320]"></div>

      <div className="relative z-10 w-full max-w-3xl text-center animate-fadeIn">
        
        <h1 className="text-4xl font-bold text-blue-400 mb-6 animate-bounceDown">
          Contactez-nous
        </h1>

        <p className="text-lg text-white mb-12 animate-slideFadeIn delay-200">
          Pour toute question ou information sur <strong>BusWay</strong>, vous pouvez nous contacter via :
        </p>

        {/* Glass Contact Card frosty */}
        <div className="bg-[#0d0a2e] backdrop-blur-[30px] border border-white/20 shadow-2xl p-12 rounded-2xl text-left animate-popUp hover:scale-105 hover:shadow-blue-400 transition duration-500">
          
          <p className="flex items-center mb-6 text-white font-semibold">
            <FaMapMarkerAlt className="mr-3 text-blue-400" />
            <strong>Adresse :</strong>&nbsp; 123 Rue des Bus, Oujda, Maroc
          </p>

          <p className="flex items-center mb-6 text-white font-semibold">
            <FaEnvelope className="mr-3 text-blue-400" />
            <strong>Email :</strong>&nbsp; contact@busway.com
          </p>

          <p className="flex items-center mb-6 text-white font-semibold">
            <FaPhone className="mr-3 text-blue-400" />
            <strong>Téléphone :</strong>&nbsp; +212 7 70 28 57 97
          </p>

          <p className="flex items-center gap-4 text-white font-semibold">
            <strong>Suivez-nous :</strong>

            <a href="#" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition">
              <FaFacebook /> Facebook
            </a>

            <a href="#" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition">
              <FaTwitter /> Twitter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
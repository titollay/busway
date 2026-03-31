
import React from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebook, FaTwitter } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="relative min-h-[120vh] flex items-start justify-center pt-32 pb-20 px-6 font-sans overflow-hidden bg-[#07041B]">
      {/* Background */}
      <div className="absolute inset-0 bg-[#070320]"></div>

      <div className="relative z-10 w-full max-w-5xl text-center animate-fadeIn">
        {/* le titre principale*/}
        <h1 className="text-4xl font-bold text-blue-400 mb-8 animate-bounceDown">
          Contactez-nous
        </h1>

        {/* Card*/}
        <div className="bg-[#0d0a2e] backdrop-blur-[30px] border border-white/20 shadow-2xl p-8 rounded-2xl flex flex-col md:flex-row gap-8 animate-popUp hover:scale-105 hover:shadow-blue-400 transition duration-500">

          {/* Left: les informations de contact*/}
          <div className="flex-1 text-left text-white">
            <h2 className="text-2xl font-bold text-blue-400 mb-6">Informations de contact</h2>
            <p className="flex items-center mb-4 font-semibold">
              <FaMapMarkerAlt className="mr-3 text-blue-400" />
              <strong>Adresse :</strong> 123 Rue des Bus, Oujda, Maroc
            </p>
            <p className="flex items-center mb-4 font-semibold">
              <FaEnvelope className="mr-3 text-blue-400" />
              <strong>Email :</strong> contact@busway.com
            </p>
            <p className="flex items-center mb-4 font-semibold">
              <FaPhone className="mr-3 text-blue-400" />
              <strong>Téléphone :</strong> +212 7 70 28 57 97
            </p>
            <p className="flex items-center gap-4 font-semibold">
              <strong>Suivez-nous :</strong>
              <a href="#" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition">
                <FaFacebook /> Facebook
              </a>
              <a href="#" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition">
                <FaTwitter /> Twitter
              </a>
            </p>
          </div>

          {/* Right: Formulaire */}
          <div className="flex-1 text-left">
            <h2 className="text-2xl font-bold text-blue-400 mb-6">Envoyez-nous un message</h2>
            <form action="/send" method="POST" className="flex flex-col gap-4">
             <input
  type="text"
  name="name"
  placeholder="Votre nom"
  required
  className="px-4 py-2 rounded-lg border border-gray-600 bg-[#0d0a2e] text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/70"
/>

<input
  type="email"
  name="email"
  placeholder="Votre email"
  required
  className="px-4 py-2 rounded-lg border border-gray-600 bg-[#0d0a2e] text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/70"
/>

<input
  type="text"
  name="subject"
  placeholder="Sujet"
  required
  className="px-4 py-2 rounded-lg border border-gray-600 bg-[#0d0a2e] text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/70"
/>

<textarea
  name="message"
  rows="5"
  placeholder="Votre message"
  required
  className="px-4 py-2 rounded-lg border border-gray-600 bg-[#0d0a2e] text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/70"
/>

<button
  type="submit"
  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
>
  Envoyer
</button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
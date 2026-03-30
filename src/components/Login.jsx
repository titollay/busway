import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ajoute ta logique d'authentification ici
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen bg-[#070320] flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="BusWay" className="h-16 object-contain" />
        </div>

        {/* Card */}
        <div
          className="bg-[#0d0a2e] border border-blue-900/40 rounded-2xl p-10"
          style={{ boxShadow: "0 4px 30px rgba(0,0,0,0.5)" }}
        >
          {/* Title */}
          <p className="text-blue-400 text-xs uppercase tracking-widest font-medium mb-2 text-center">
            BIENVENUE
          </p>
          <h1
            className="text-3xl font-bold text-white text-center mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Connexion
          </h1>

          {/* Form */}
          <div className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@busway.com"
                className="w-full bg-[#070320] border border-blue-900/40 rounded-xl px-4 py-3 text-white text-sm
                           placeholder:text-gray-600 focus:outline-none focus:border-blue-500/60
                           transition duration-300"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#070320] border border-blue-900/40 rounded-xl px-4 py-3 text-white text-sm
                             placeholder:text-gray-600 focus:outline-none focus:border-blue-500/60
                             transition duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-400 transition text-xs"
                >
                  {showPassword ? "Cacher" : "Voir"}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition">
                Mot de passe oublié ?
              </a>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl
                         transition duration-300 hover:scale-[1.02] text-sm tracking-wide"
            >
              Se connecter
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 border-t border-blue-900/30" />
              <span className="text-gray-600 text-xs">ou</span>
              <div className="flex-1 border-t border-blue-900/30" />
            </div>

            {/* Register */}
            <p className="text-center text-gray-500 text-sm">
              Pas encore de compte ?{" "}
              <a href="/register" className="text-blue-400 hover:text-blue-300 transition font-medium">
                S'inscrire
              </a>
            </p>

          </div>
        </div>

        {/* Back home */}
        <p className="text-center mt-6">
          <a
            onClick={() => navigate("/")}
            className="text-xs text-gray-600 hover:text-blue-400 transition cursor-pointer"
          >
            ← Retour à l'accueil
          </a>
        </p>

      </div>
    </div>
  );
}
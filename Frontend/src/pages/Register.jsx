import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Register() {
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
        alert("Les mots de passe ne correspondent pas !");
        return;
    }
    console.log({ nom, email, password });
    // Ici tu peux ajouter la logique d'envoi à ton API
    };

    return (
    <div className="min-h-screen bg-[#070320] flex items-center justify-center px-6 py-12 animate-fade-in">

        <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-8">
            <img src={logo} alt="BusWay" className="h-16 object-contain" />
        </div>

        {/* Card */}
        <div
            className="bg-[#0d0a2e] border border-blue-900/40 rounded-2xl p-10 animate-fade-in-delay"
            style={{ boxShadow: "0 4px 30px rgba(0,0,0,0.5)" }}
        >
          {/* Title */}
            <p className="text-blue-400 text-xs uppercase tracking-widest font-medium mb-2 text-center animate-pulse">
            NOUVEAU COMPTE
            </p>
            <h1
            className="text-3xl font-bold text-white text-center mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
            >
            S'inscrire
            </h1>

          {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Nom */}
            <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
                Nom complet
                </label>
                <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Votre nom"
                className="w-full bg-[#070320] border border-blue-900/40 rounded-xl
                            px-4 py-3 text-white text-sm placeholder:text-gray-600
                            focus:outline-none focus:border-blue-500/60 transition duration-300"
                />
            </div>

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
                className="w-full bg-[#070320] border border-blue-900/40 rounded-xl
                            px-4 py-3 text-white text-sm placeholder:text-gray-600
                            focus:outline-none focus:border-blue-500/60 transition duration-300"
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
                    className="w-full bg-[#070320] border border-blue-900/40 rounded-xl
                                px-4 py-3 text-white text-sm placeholder:text-gray-600
                                focus:outline-none focus:border-blue-500/60 transition duration-300"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2
                    text-gray-500 hover:text-blue-400 transition text-xs"
                >
                    {showPassword ? "Cacher" : "Voir"}
                </button>
                </div>
            </div>

            {/* Confirm Password */}
            <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
                Confirmer le mot de passe
                </label>
                <div className="relative">
                <input
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#070320] border border-blue-900/40 rounded-xl
                                px-4 py-3 text-white text-sm placeholder:text-gray-600
                                focus:outline-none focus:border-blue-500/60 transition duration-300"
                />
                <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2
                    text-gray-500 hover:text-blue-400 transition text-xs"
                >
                    {showConfirm ? "Cacher" : "Voir"}
                </button>
                </div>
            </div>

            {/* Submit */}
            <button
                type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold
            py-3 rounded-xl transition duration-300 hover:scale-[1.02]
            text-sm tracking-wide"
            >
                Créer mon compte
            </button>

            </form>

          {/* Divider */}
            <div className="flex items-center gap-3 my-4">
            <div className="flex-1 border-t border-blue-900/30" />
            <span className="text-gray-600 text-xs">ou</span>
            <div className="flex-1 border-t border-blue-900/30" />
            </div>

          {/* Login link */}
            <p className="text-center text-gray-500 text-sm">
            Déjà un compte ?{" "}
            <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 transition font-medium"
            >
                Se connecter
            </Link>
            </p>

        </div>

        {/* Back home */}
        <p className="text-center mt-6">
            <span
            onClick={() => navigate("/")}
            className="text-xs text-gray-600 hover:text-blue-400 transition cursor-pointer"
            >
            ← Retour à l'accueil
            </span>
        </p>
</div>

            {/* Fade-in animation */}
            <style jsx>{`
                @keyframes fade-in-opacity {
                0% {
                opacity: 0;
                }
                100% {
                opacity: 1;
                }
            }.animate-fade-in {
                opacity: 0;
                animation: fade-in-opacity 1s ease-out forwards;
                }
                .animate-fade-in-delay {
                opacity: 0;
                animation: fade-in-opacity 1s ease-out forwards;
                animation-delay: 0.2s;
                }
            `}</style>
            </div>
        );}
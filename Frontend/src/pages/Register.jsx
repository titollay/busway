import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import img3 from "../assets/busregis.jpg";
import logo from "../assets/logo.png";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Register() {
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nom.trim() || !email.trim() || !password.trim()) {
      setError("Veuillez remplir les champs obligatoires.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/auth/register.php', { 
        nom: nom.trim(),
        email: email.trim().toLowerCase(), 
        telephone: telephone.trim(),
        password 
      });
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Nouveau compte -> Map des usagers
      navigate('/map');

    } catch (err) {
      console.error("DEBUG REGISTER ERROR:", err);
      if (err.response) {
        setError(err.response.data.message || "Erreur lors de l'inscription.");
      } else {
        setError("Impossible de contacter le serveur.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .login-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100dvh;
          display: grid;
          grid-template-columns: 1fr;
          background: #ffffff;
        }
        @media (min-width: 1024px) { .login-root { grid-template-columns: 1fr 1fr; } }

        .login-input-wrap {
          position: relative;
          border-bottom: 1px solid rgba(0,0,0,0.12);
          transition: border-color 0.3s ease;
        }
        .login-input-wrap.focused { border-bottom-color: #2563eb; }

        .login-input {
          width: 100%; background: transparent; border: none; outline: none;
          color: #1a1a1a; font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
          padding: 12px 36px 12px 0; transition: color 0.3s ease;
        }
        .login-input::placeholder { color: rgba(0,0,0,0.3); font-size: 0.8rem; letter-spacing: 0.05em; }

        .login-input-icon {
          position: absolute; right: 0; top: 50%; transform: translateY(-50%);
          color: rgba(0,0,0,0.3); font-size: 0.8rem;
          transition: color 0.3s ease; cursor: pointer;
        }
        .login-input-wrap.focused .login-input-icon { color: #2563eb; }

        .login-label {
          font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(0,0,0,0.45); margin-bottom: 4px; display: block;
          transition: color 0.3s ease;
        }

        .login-btn {
          position: relative; overflow: hidden; width: 100%; padding: 14px;
          background: transparent; border: 1px solid rgba(37,99,235,0.5);
          border-radius: 6px;
          color: #2563eb; font-family: 'DM Sans', sans-serif; font-size: 0.75rem;
          letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer;
          transition: color 0.35s ease;
        }
        .login-btn::before {
          content: ''; position: absolute; inset: 0; background: #2563eb;
          transform: translateX(-101%); transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .login-btn:hover::before { transform: translateX(0); }
        .login-btn:hover { color: #fff; }
        .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .login-btn span { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; gap: 8px; }

        .login-img-panel { position: relative; overflow: hidden; display: none; }
        @media (min-width: 1024px) { .login-img-panel { display: block; } }
        .login-img-panel img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6) contrast(1.1); }

        .login-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 80%);
          display: flex; flex-direction: column; justify-content: flex-end; padding: 48px;
        }

        .login-divider {
          position: absolute; right: 0; top: 10%; bottom: 10%; width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(37,99,235,0.3), transparent);
        }

        .login-form-panel::before {
          content: ''; position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none; opacity: 0.6;
        }

        .login-error {
          background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25);
          color: #ef4444; font-size: 0.72rem; padding: 10px 14px;
          letter-spacing: 0.05em; display: flex; align-items: center; gap: 8px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>

      <div className="login-root">
        {/* ── LEFT: Image Panel ── */}
        <div className="login-img-panel">
          <div className="login-divider" />
          <img src={img3} alt="BusWay background" />
          <div className="login-img-overlay">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.6,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <p className="text-xs uppercase tracking-[0.25em] text-[#2563eb] mb-3">
                Opportunité
              </p>
              <h2
                className="text-4xl font-light text-white leading-tight max-w-xs"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Rejoignez,
                <br />
                <em className="text-[#2563eb]">notre communauté.</em>
              </h2>
              <div className="w-8 h-px bg-[#2563eb] mt-6" />
            </motion.div>
          </div>
        </div>

        {/* ── RIGHT: Form Panel ── */}
        <div className="login-form-panel relative flex flex-col justify-center px-8 sm:px-16 xl:px-24 py-8 min-h-dvh">
          <div
            className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at top right, rgba(37,99,235,0.05) 0%, transparent 70%)",
            }}
          />

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="relative z-10 max-w-sm w-full mx-auto"
          >
            {/* Logo */}
            <motion.div variants={item} className="mb-8 flex justify-center">
              <a href="/" className="flex items-center gap-3">
                <img src={logo} className="h-10 object-contain" alt="logo" />
                <span className="text-2xl font-bold tracking-wide text-[#2563eb]">BusWay</span>
              </a>
            </motion.div>

            {/* Heading */}
            <motion.div variants={item} className="mb-8 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-[#2563eb] mb-2">
                Nouveau Client
              </p>
              <h1
                className="text-3xl font-light text-gray-900 leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Créer votre
                <br />
                <em className="text-[#2563eb]">compte personnel</em>
              </h1>
            </motion.div>

            {/* ── Form ── */}
            <motion.form
              variants={container}
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              {error && (
                <motion.div
                  className="login-error"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <i className="fa-solid fa-circle-exclamation text-xs"></i>
                  {error}
                </motion.div>
              )}

              {/* Nom */}
              <motion.div variants={item}>
                <label className="login-label">Nom complet</label>
                <div className={`login-input-wrap ${focused === "nom" ? "focused" : ""}`}>
                  <input
                    type="text"
                    placeholder="Votre Nom"
                    className="login-input"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    onFocus={() => setFocused("nom")}
                    onBlur={() => setFocused("")}
                    required
                  />
                  <span className="login-input-icon"><i className="fa-regular fa-user"></i></span>
                </div>
              </motion.div>

              {/* Email */}
              <motion.div variants={item}>
                <label className="login-label">Adresse e-mail</label>
                <div className={`login-input-wrap ${focused === "email" ? "focused" : ""}`}>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className="login-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused("")}
                    required
                  />
                  <span className="login-input-icon"><i className="fa-regular fa-envelope"></i></span>
                </div>
              </motion.div>

              {/* Telephone */}
              <motion.div variants={item}>
                <label className="login-label">Téléphone (Optionnel)</label>
                <div className={`login-input-wrap ${focused === "phone" ? "focused" : ""}`}>
                  <input
                    type="tel"
                    placeholder="+212 6..."
                    className="login-input"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    onFocus={() => setFocused("phone")}
                    onBlur={() => setFocused("")}
                  />
                  <span className="login-input-icon"><i className="fa-solid fa-phone-flip text-[0.7rem]"></i></span>
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={item}>
                <label className="login-label">Mot de passe</label>
                <div className={`login-input-wrap ${focused === "password" ? "focused" : ""}`}>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="8 caractères min."
                    className="login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused("")}
                    required
                  />
                  <span className="login-input-icon" onClick={() => setShowPass(!showPass)}>
                    <i className={`fa-regular ${showPass ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </span>
                </div>
              </motion.div>

              {/* Confirm Password */}
              <motion.div variants={item}>
                <label className="login-label">Confirmer le mot de passe</label>
                <div className={`login-input-wrap ${focused === "confirm" ? "focused" : ""}`}>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Répétez le mot de passe"
                    className="login-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocused("confirm")}
                    onBlur={() => setFocused("")}
                    required
                  />
                  <span className="login-input-icon"><i className="fa-solid fa-lock text-[0.7rem]"></i></span>
                </div>
              </motion.div>

              {/* Submit */}
              <motion.div variants={item}>
                <button type="submit" className="login-btn" disabled={loading}>
                  <span>
                    {loading ? (
                      <><div style={{width:14,height:14,border:"2px solid rgba(37,99,235,0.3)",borderTopColor:"#2563eb",borderRadius:"50%"}} className="spin pulse"></div> Inscription...</>
                    ) : (
                      "Créer mon compte →"
                    )}
                  </span>
                </button>
              </motion.div>

              {/* Footer links */}
              <motion.div variants={item} className="space-y-3 pt-2 text-center">
                <a href="/login" className="text-xs text-gray-500 font-medium hover:text-[#2563eb] transition-colors uppercase tracking-wider">
                  Déjà un compte ? Se connecter
                </a>
                <p>
                  <a href="/" className="text-xs text-gray-500 font-medium hover:text-[#2563eb] transition-colors flex items-center justify-center gap-2 uppercase tracking-wider">
                    <i className="fa-solid fa-arrow-left text-[0.6rem]"></i> Retour au site
                  </a>
                </p>
              </motion.div>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </>
  );
}
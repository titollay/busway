import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

// ─── Data ─────────────────────────────────────────────────────────────────────

const navigation = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/#about" },
  { label: "Nos Services", href: "/#services" },
  { label: "Témoignages", href: "/#testimonial" },
  { label: "Contact", href: "/#contact" },
];

const services = [
  { label: "Suivi en Temps Réel", href: "/map" },
  { label: "Temps d'Arrivée Estimé", href: "/map" },
  { label: "Arrêt le Plus Proche", href: "/map" },
  { label: "Notifications Push", href: "#" },
  { label: "Carte Interactive", href: "/map" },
];

const company = [
  { label: "À propos de BusWay", href: "/#about" },
  { label: "Conditions d'utilisation", href: "#" },
  { label: "Politique de confidentialité", href: "#" },
  { label: "Espace Admin", href: "/index" },
];

const socials = [
  {
    label: "Facebook",
    href: "https://facebook.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "https://twitter.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Footer() {
  const location = useLocation();
  const year = new Date().getFullYear();

  // Hide footer on auth + admin + driver pages
  const hide = ["/login", "/register", "/gps-conducteur", "/index"].some((p) =>
    location.pathname.startsWith(p)
  );
  if (hide) return null;

  return (
    <>
      <style>{`
        .footer-root {
          background: #070320;
          color: rgba(255,255,255,0.6);
          font-family: 'DM Sans', 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .footer-root::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(59,130,246,0.45), transparent);
        }
        .footer-heading {
          font-size: 0.65rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #60a5fa;
          font-weight: 600;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .footer-heading::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(59,130,246,0.2);
        }
        .footer-link {
          display: block;
          font-size: 0.82rem;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          padding: 5px 0;
          transition: all 0.25s ease;
          position: relative;
          width: fit-content;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          bottom: 2px; left: 0;
          width: 0; height: 1px;
          background: #3b82f6;
          transition: width 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .footer-link:hover { color: #fff; transform: translateX(5px); }
        .footer-link:hover::after { width: 100%; }

        .footer-social {
          width: 36px; height: 36px;
          border: 1px solid rgba(255,255,255,0.1);
          display: inline-flex;
          align-items: center; justify-content: center;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          transition: all 0.3s ease;
          border-radius: 6px;
          flex-shrink: 0;
        }
        .footer-social:hover {
          border-color: #3b82f6;
          color: #fff;
          background: rgba(59,130,246,0.2);
          transform: translateY(-3px);
        }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.06);
          font-size: 0.72rem;
          color: rgba(255,255,255,0.3);
        }
        .footer-input {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 11px 14px;
          width: 100%;
          color: #fff;
          font-size: 0.8rem;
          outline: none;
          transition: all 0.3s;
        }
        .footer-input::placeholder { color: rgba(255,255,255,0.3); }
        .footer-input:focus {
          border-color: #3b82f6;
          background: rgba(59,130,246,0.08);
        }
        .footer-sub-btn {
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: #fff;
          border-radius: 10px;
          padding: 10px 16px;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          transition: all 0.3s;
          margin-top: 10px;
          width: 100%;
          border: none;
          cursor: pointer;
        }
        .footer-sub-btn:hover {
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59,130,246,0.3);
        }
        .footer-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 0.7rem;
          color: #60a5fa;
          font-weight: 500;
          margin-bottom: 1.5rem;
        }
        .footer-badge-dot {
          width: 6px; height: 6px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <footer className="footer-root pt-20 pb-8">
        {/* Ambient glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-48 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">

            {/* ── Brand ── */}
            <div className="lg:col-span-4">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={logo}
                  alt="BusWay Logo"
                  className="h-10 w-auto object-contain"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                <span
                  className="text-white text-xl font-bold tracking-wide"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  BusWay
                </span>
              </div>

              {/* Live badge */}
              <div className="footer-badge">
                <span className="footer-badge-dot" />
                Service actif · Oujda
              </div>

              <p className="text-sm text-white/50 leading-relaxed max-w-xs mb-8">
                Suivez vos bus en temps réel, planifiez vos trajets et
                déplacez-vous en ville sans stress. BusWay, la mobilité
                urbaine intelligente.
              </p>

              {/* Socials */}
              <div className="flex items-center gap-2">
                {socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    className="footer-social"
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* ── Navigation ── */}
            <div className="lg:col-span-2">
              <h5 className="footer-heading">Navigation</h5>
              <ul className="space-y-1">
                {navigation.map((item, i) => (
                  <li key={i}>
                    <a href={item.href} className="footer-link">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Services ── */}
            <div className="lg:col-span-2">
              <h5 className="footer-heading">Services</h5>
              <ul className="space-y-1">
                {services.map((item, i) => (
                  <li key={i}>
                    <Link to={item.href} className="footer-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Company ── */}
            <div className="lg:col-span-2">
              <h5 className="footer-heading">Entreprise</h5>
              <ul className="space-y-1">
                {company.map((item, i) => (
                  <li key={i}>
                    <a href={item.href} className="footer-link">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Newsletter ── */}
            <div className="lg:col-span-2">
              <h5 className="footer-heading">Alertes & Infos</h5>
              <p className="text-[0.65rem] text-white/70 uppercase tracking-widest font-bold mb-4">
                Restez informé
              </p>
              <input
                type="email"
                placeholder="votre@email.com"
                className="footer-input"
              />
              <button className="footer-sub-btn">S'abonner →</button>
            </div>
          </div>

          {/* ── Bottom Bar ── */}
          <div className="footer-bottom pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center uppercase tracking-widest font-medium">
            <p>
              &copy; {year}{" "}
              <span className="text-blue-400 font-semibold">BusWay</span>.
              Tous droits réservés.
            </p>
            <p style={{ textTransform: "none", letterSpacing: "normal" }} className="text-white/30 text-[0.72rem]">
              Développé par{" "}
              <a
                href="https://www.linkedin.com/in/taha-allay-baa0a72a9/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-white transition-colors"
              >
                Wiam, Safae & Taha
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
import React from "react";
import bus from "./assets/bus.jpg";
import bus2 from "./assets/bus2.jpg";

export default function About() {
  return (
    <div className="bg-[#070320] text-white overflow-hidden">

      {/* ── SECTION 1 : ABOUT US ── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row items-center gap-16">

          {/* LEFT — Texte avec animations */}
          <div className="flex-1 space-y-6 animate-fade-in-up ml-2">
            <p className="text-blue-400 text-xs uppercase tracking-widest font-medium mb-4 animate-pulse">
              ABOUT US
            </p>

            <h2
              className="text-5xl font-bold leading-tight mb-6 text-white transition-all duration-700 hover:scale-[1.02] hover:text-blue-100"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Suivi des Bus <br /> en Temps Réel
            </h2>

            <p className="text-sm leading-relaxed text-blue-100 opacity-70 mb-4 max-w-md transition-opacity duration-500 hover:opacity-100">
              BusWay est une application web dédiée au suivi des bus en temps
              réel dans la ville. Son objectif est d'aider les usagers du
              transport public à connaître la position des bus et à mieux
              organiser leurs déplacements.
            </p>

            <p className="text-sm leading-relaxed text-blue-100 opacity-70 mb-8 max-w-md transition-opacity duration-500 hover:opacity-100">
              Grâce à une carte interactive, à l'intégration du GPS et à des
              notifications, BusWay permet d'obtenir des informations claires
              et rapides sur les trajets et l'arrivée des bus dans la ville.
            </p>

            <a
              href="#"
              className="group inline-flex items-center gap-2 text-blue-400 text-sm font-medium border-b border-blue-400 border-opacity-40 pb-0.5 transition-all duration-300 hover:border-opacity-100 hover:gap-4 hover:text-blue-300"
            >
              Découvrir l'application 
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>

          {/* RIGHT — Photos superposées avec effets */}
          <div
            className="flex-1 relative w-full group"
            style={{ minHeight: 360, height: 400 }}
          >
            {/* Cadre décoratif derrière avec animation */}
            <div
              className="absolute top-0 border-2 border-blue-500/30 rounded-2xl pointer-events-none transition-all duration-700 group-hover:border-blue-400/60 group-hover:scale-105 group-hover:rotate-1"
              style={{ right: 28, width: "58%", height: "57%" }}
            />

            {/* Photo principale — haut droite */}
            <div
              className="absolute rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-blue-500/20 hover:z-10"
              style={{ top: "3%", right: 0, width: "63%", height: "57%" }}
            >
              <img
                src={bus}
                alt="Bus en ville"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-tb from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Photo secondaire — bas gauche */}
            <div
              className="absolute rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-blue-500/20 hover:z-10"
              style={{ bottom: 0, left: 0, width: "53%", height: "51%" }}
            >
              <img
                src={bus2}
                alt="Intérieur bus"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-tb from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Élément décoratif flottant */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-700" />

          </div>

        </div>
      </section>

      {/* Animation keyframes personnalisés */}
      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>

    </div>
  );
}
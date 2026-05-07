import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "../../styles/index.css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

import img1 from "../../assets/team/1.webp";
import img12 from "../../assets/team/12.webp";
import img19 from "../../assets/team/19.webp";
import img13 from "../../assets/team/13.webp";
import img14 from "../../assets/team/14.webp";
import img15 from "../../assets/team/15.webp";

// ─── Data ───────────────────────────────────────────────────────────────────

const stats = [
  { value: "10K+", label: "Voyageurs Heureux" },
  { value: "4.9", label: "Note Moyenne" },
  { value: "24/7", label: "Support Client" },
  { value: "50+", label: "Stations Couvertes" },
];

const testimonials = [
  {
    img: img1,
    name: "Sarah M.",
    role: "Abonnée Mensuelle",
    date: "Janvier 2026",
    stars: 5,
    text: "J'adore la qualité du service ! Les bus sont toujours à l'heure, très confortables, et se déplacer en ville n'a jamais été aussi simple. Je recommande vivement BusWay.",
  },
  {
    img: img12,
    name: "Karim A.",
    role: "Trajet Domicile-Travail",
    date: "Février 2026",
    stars: 5,
    text: "Des prix très attractifs pour les abonnements. Mon trajet quotidien vers le centre-ville est devenu un véritable moment de détente.",
  },
  {
    img: img19,
    name: "Leila T.",
    role: "Usagère Régulière",
    date: "Mars 2026",
    stars: 4,
    text: "Très satisfaite ! Fini le stress des embouteillages, les bus sont réguliers et propres. Une excellente solution de transport urbain.",
  },
  {
    img: img13,
    name: "Youssef B.",
    role: "Étudiant",
    date: "Mars 2026",
    stars: 5,
    text: "Une flotte moderne et interconnectée. C'est de loin le moyen de transport le plus pratique pour me rendre à l'université tous les jours.",
  },
  {
    img: img14,
    name: "Amal R.",
    role: "Usagère Occasionnelle",
    date: "Avril 2026",
    stars: 5,
    text: "Chauffeurs professionnels et conduite douce, parfait pour traverser la ville sans stress. Le Wi-Fi à bord permet même de consulter ses e-mails !",
  },
  {
    img: img15,
    name: "Omar K.",
    role: "Professionnel",
    date: "Avril 2026",
    stars: 4,
    text: "La fréquence des lignes et la couverture de la ville me facilitent la vie au quotidien. L'application mobile pour les temps d'attente est top.",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StarRating({ stars }) {
  return (
    <div className="flex gap-0.5 text-blue-400 text-lg">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < stars ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

function TestimonialCard({ t }) {
  return (
    <div className="bg-[#0d0a2e]/60 backdrop-blur-sm border border-blue-900/40 rounded-2xl p-6 flex flex-col gap-4 h-full hover:bg-[#0d0a2e]/80 transition-all duration-300">
      {/* Quote icon */}
      <span className="text-blue-500 text-5xl leading-none font-serif">
        "
      </span>

      {/* Stars */}
      <StarRating stars={t.stars} />

      {/* Text */}
      <p className="text-gray-200 text-sm lg:text-base leading-relaxed flex-1">
        {t.text}
      </p>

      {/* Divider */}
      <div className="border-t border-blue-900/30" />

      {/* Author */}
      <div className="flex items-center gap-3">
        <img
          src={t.img}
          alt={t.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
        />
        <div>
          <p className="font-bold text-white text-sm">{t.name}</p>
          <p className="text-blue-300 text-xs">{t.role}</p>
        </div>
        <span className="ml-auto text-gray-500 text-xs">{t.date}</span>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Testimonials() {
  return (
    <div id="testimonial" className="relative bg-[#070320]">
      <section className="relative text-white overflow-hidden ">
        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-[#070320] via-transparent to-[#070320] z-0" />

        {/* ── MAIN CONTENT ── */}
        <div className="relative z-10 px-6 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-8">
            {/* Header */}
            <div className="text-left mb-14" data-aos="fade-up">
              <p className="text-xs uppercase tracking-[0.3em] text-blue-400 mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-blue-400 inline-block" />
                Vos Témoignages
              </p>
              <h2 className="display text-3xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Ce que disent nos usagers
              </h2>
              <p className="text-gray-400 max-w-xl leading-relaxed">
                Découvrez pourquoi des milliers de citadins font confiance à BusWay pour leurs trajets quotidiens en ville, rapides, confortables et sans stress.
              </p>
            </div>

            {/* ── FEATURED SLIDER ── */}
            <div className="mb-12" data-aos="fade-up">
              <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                spaceBetween={30}
                slidesPerView={1}
                autoplay={{ delay: 5000, pauseOnMouseEnter: true }}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                navigation={false}
                pagination={{ clickable: true }}
                keyboard={{ enabled: true }}
                loop={true}
              >
                {testimonials.slice(0, 3).map((t, i) => (
                  <SwiperSlide key={i}>
                    <div className="flex flex-col lg:flex-row items-center gap-10 pb-10 px-2 lg:px-16">
                      {/* Avatar */}
                      <div className="shrink-0">
                        <div className="relative">
                          <img
                            src={t.img}
                            alt={t.name}
                            width={180}
                            height={180}
                            className="rounded-2xl object-cover border-4 border-blue-500 shadow-xl"
                          />
                          <div className="absolute -bottom-3 -right-3 bg-blue-600 rounded-full px-3 py-1 text-xs font-bold shadow">
                            {t.role}
                          </div>
                        </div>
                      </div>

                      {/* Text */}
                      <div className="text-center lg:text-left">
                        <span className="text-blue-500 text-7xl leading-none font-serif">
                          "
                        </span>
                        <div className="flex justify-center lg:justify-start">
                           <StarRating stars={t.stars} />
                        </div>
                        <h3 className="text-xl lg:text-2xl font-medium my-4 leading-relaxed text-gray-200" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {t.text}
                        </h3>
                        <div className="flex items-center justify-center lg:justify-start gap-4">
                          <p className="font-bold text-white">{t.name}</p>
                          <span className="text-white/30">•</span>
                          <p className="text-gray-500 text-sm">{t.date}</p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* ── GRID ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(3).map((t, i) => (
                <div key={i} data-aos="fade-up" data-aos-delay={i * 100}>
                  <TestimonialCard t={t} />
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

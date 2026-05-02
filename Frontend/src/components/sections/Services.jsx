import { FaBus, FaClock, FaMapMarkerAlt, FaBell, FaMap, FaRoute } from "react-icons/fa";
import React from "react";

function Services() {
  const services = [
    { icon: <FaBus size={35} />, title: "Suivi du Bus en Temps Réel", desc: "Suivez la position du bus en temps réel grâce au GPS.", color: "bg-red-500", shadow: "rgba(239,68,68,0.4)" },
    { icon: <FaClock size={35} />, title: "Temps d'Arrivée Estimé", desc: "Consultez le temps estimé d'arrivée du bus à votre arrêt.", color: "bg-yellow-400", shadow: "rgba(250,204,21,0.4)" },
    { icon: <FaMapMarkerAlt size={35} />, title: "Arrêt le Plus Proche", desc: "Trouvez automatiquement l'arrêt de bus le plus proche.", color: "bg-green-500", shadow: "rgba(34,197,94,0.4)" },
    { icon: <FaBell size={35} />, title: "Notifications", desc: "Recevez une notification lorsque le bus approche.", color: "bg-pink-500", shadow: "rgba(236,72,153,0.4)" },
    { icon: <FaMap size={35} />, title: "Carte Interactive", desc: "Visualisez les lignes de bus sur une carte interactive.", color: "bg-purple-500", shadow: "rgba(168,85,247,0.4)" },
    { icon: <FaRoute size={35} />, title: "Distance Bus", desc: "Consultez la distance entre vous et le bus.", color: "bg-orange-400", shadow: "rgba(251,146,60,0.4)" }
  ];

  return (
    <div className="min-h-screen bg-[#070320] py-16 px-6 text-white">

      {/* Title */}
      <h1 className="text-4xl font-bold text-center text-blue-400 mb-4">
        Nos Services
      </h1>

      <p className="text-center text-gray-300 mb-14">
        Découvrez les fonctionnalités de <strong>BusWay</strong> pour faciliter vos déplacements.
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-[#0d0a2e] border border-blue-900/40 rounded-xl p-8 text-center
                       transform transition-all duration-500
                       hover:-translate-y-4 hover:border-blue-500/60
                       animate-dropTop"
            style={{
              animationDelay: `${index * 150}ms`,
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
            }}
          >
            {/* Icon */}
            <div
              className={`mb-4 flex justify-center items-center w-16 h-16 mx-auto rounded-full ${service.color}
                          transition-transform duration-500 hover:scale-125`}
              style={{ boxShadow: `0 4px 20px ${service.shadow}` }}
            >
              {React.cloneElement(service.icon, { color: "white" })}
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold mb-3 text-white">{service.title}</h2>

            {/* Description */}
            <p className="text-gray-400 text-sm">{service.desc}</p>
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="flex justify-center mt-16">
        <button className="bg-blue-600 text-white px-10 py-4 rounded-xl text-lg
                           shadow-lg transition duration-500
                           hover:bg-blue-700 hover:scale-110">
          Explorer la carte
        </button>
      </div>

      {/* ✅ style sans jsx */}
      <style>{`
        @keyframes dropTop {
          0% { opacity: 0; transform: translateY(-80px); }
          60% { opacity: 1; transform: translateY(10px); }
          80% { transform: translateY(-5px); }
          100% { transform: translateY(0); }
        }
        .animate-dropTop {
          animation: dropTop 0.8s ease forwards;
        }
      `}</style>

    </div>
  );
}

export default Services;
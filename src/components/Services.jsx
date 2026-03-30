
import { FaBus, FaClock, FaMapMarkerAlt, FaBell, FaMap, FaRoute } from "react-icons/fa";
import React from "react";

function Services() {
  const services = [
    { icon: <FaBus size={35} />, title: "Suivi du Bus en Temps Réel", desc: "Suivez la position du bus en temps réel grâce au GPS.", color: "bg-red-500" },
    { icon: <FaClock size={35} />, title: "Temps d’Arrivée Estimé", desc: "Consultez le temps estimé d’arrivée du bus à votre arrêt.", color: "bg-yellow-400" },
    { icon: <FaMapMarkerAlt size={35} />, title: "Arrêt le Plus Proche", desc: "Trouvez automatiquement l’arrêt de bus le plus proche.", color: "bg-green-500" },
    { icon: <FaBell size={35} />, title: "Notifications", desc: "Recevez une notification lorsque le bus approche.", color: "bg-pink-500" },
    { icon: <FaMap size={35} />, title: "Carte Interactive", desc: "Visualisez les lignes de bus sur une carte interactive.", color: "bg-purple-500" },
    { icon: <FaRoute size={35} />, title: "Distance Bus", desc: "Consultez la distance entre vous et le bus.", color: "bg-orange-400" }
  ];

  return (
    <div className="min-h-screen bg-[#070320] py-16 px-6 text-white">

      {/* Title */}
      <h1 className="text-4xl font-bold text-center text-blue-400 mb-4 animate-fadeInDown">
        Nos Services
      </h1>

      <p className="text-center text-gray-300 mb-14 animate-fadeInUp delay-200">
        Découvrez les fonctionnalités de <strong>BusWay</strong> pour faciliter vos déplacements.
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white/10 rounded-xl p-8 text-center shadow-lg 
                       transform transition-all duration-500
                       hover:-translate-y-4 hover:shadow-2xl
                       animate-dropTop"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Icon */}
            <div className={`mb-4 flex justify-center items-center w-16 h-16 mx-auto rounded-full ${service.color} 
                            shadow-[0_4px_15px_rgba(0,0,0,0.5)]
                            transition-transform duration-500
                            hover:scale-125 hover:shadow-[0_8px_25px_rgba(0,0,0,0.7)]
                            `}>
              {React.cloneElement(service.icon, { color: "white" })}
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold mb-3 text-white">{service.title}</h2>

            {/* Description */}
            <p className="text-gray-300 text-sm">{service.desc}</p>
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="flex justify-center mt-16">
        <button className="bg-blue-600 text-white px-10 py-4 rounded-xl text-lg 
                           shadow-lg transition duration-500 
                           hover:bg-blue-700 hover:scale-110 hover:animate-pulse">
          Explorer la carte
        </button>
      </div>

      {/* Animations */}
      <style jsx>{`
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

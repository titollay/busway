import { FaBus, FaClock, FaMapMarkerAlt, FaBell, FaMap, FaRoute } from "react-icons/fa";
import React from "react";

function Services() {

  const services = [
    {
      icon: <FaBus size={35} />,
      title: "Suivi du Bus en Temps Réel",
      desc: "Suivez la position du bus en temps réel grâce au GPS."
    },
    {
      icon: <FaClock size={35} />,
      title: "Temps d’Arrivée Estimé",
      desc: "Consultez le temps estimé d’arrivée du bus à votre arrêt."
    },
    {
      icon: <FaMapMarkerAlt size={35} />,
      title: "Arrêt le Plus Proche",
      desc: "Trouvez automatiquement l’arrêt de bus le plus proche."
    },
    {
      icon: <FaBell size={35} />,
      title: "Notifications",
      desc: "Recevez une notification lorsque le bus approche."
    },
    {
      icon: <FaMap size={35} />,
      title: "Carte Interactive",
      desc: "Visualisez les lignes de bus sur une carte interactive."
    },
    {
      icon: <FaRoute size={35} />,
      title: "Distance Bus",
      desc: "Consultez la distance entre vous et le bus."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-6">

      {/* Title avec animation fade-in */}
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-4 
                     animate-fadeInDown">
        Our Services
      </h1>

      <p className="text-center text-gray-600 mb-14 animate-fadeInUp delay-200">
        Découvrez les fonctionnalités de BusFink pour faciliter vos déplacements.
      </p>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">

        {services.map((service, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl p-8 text-center shadow-md transform transition-all duration-500
                        hover:-translate-y-4 hover:shadow-2xl
                        animate-fadeInUp`}
            style={{ animationDelay: `${index * 100}ms` }}
          >

            {/* Icon avec rotation et bounce */}
            <div className="text-blue-500 mb-4 flex justify-center
                            transition-transform duration-500 hover:rotate-12 hover:scale-110">
              {service.icon}
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold mb-3 animate-fadeInUp">
              {service.title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm animate-fadeInUp delay-150">
              {service.desc}
            </p>

          </div>
        ))}

      </div>

      {/* Button avec pulse hover */}
      <div className="flex justify-center mt-16">
        <button className="bg-blue-600 text-white px-10 py-4 rounded-xl text-lg 
                           shadow-lg transition duration-500 hover:bg-blue-700 
                           hover:scale-110 hover:animate-pulse">
          Explorer la carte
        </button>
      </div>

      {/* Animations keyframes personnalisées */}
      <style jsx>{`
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease forwards;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease forwards;
        }
        .delay-150 {
          animation-delay: 150ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>

    </div>
  );
}

export default Services;

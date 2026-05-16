import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 dark:bg-[#0b0f1a]/80 backdrop-blur-md">
      <div className="loader-container transform scale-75 md:scale-100">
        <div className="custom-loader" />
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em] mt-20 text-center animate-pulse">
          Chargement en cours
        </p>
      </div>
    </div>
  );
}

export default Loader;

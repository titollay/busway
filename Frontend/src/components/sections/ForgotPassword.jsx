import React, { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset password for:", email);

    // هنا غادي دير API call باش تبعث email
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070320]">
      <div className="bg-[#0d0a2e] p-8 rounded-xl w-full max-w-md">
        <h2 className="text-white text-2xl mb-6 text-center">
          Mot de passe oublié
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Entrer votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded mb-4 bg-[#070320] text-white border border-blue-900/40"
          />

          <button className="w-full bg-blue-600 py-3 rounded text-white">
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}
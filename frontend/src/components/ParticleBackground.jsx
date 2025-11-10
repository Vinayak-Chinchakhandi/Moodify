import React from "react";

const ParticleBackground = ({ count = 25 }) => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="particle"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 4}s`,
        }}
      />
    ))}
  </div>
);

export default ParticleBackground;

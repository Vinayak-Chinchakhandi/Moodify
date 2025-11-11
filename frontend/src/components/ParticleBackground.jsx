const ParticleBackground = ({ count = 30 }) => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => {
        const top = `${Math.random() * 100}%`;
        const left = `${Math.random() * 100}%`;
        const delay = `${(Math.random() * 4).toFixed(2)}s`;
        // randomly add drift class to a subset
        const drift = Math.random() > 0.6 ? "particle--drift" : "";
        const size = Math.random() > 0.85 ? "w-3 h-3" : ""; // occasional bigger particle

        return (
          <div
            key={i}
            className={`particle ${drift} ${size}`}
            style={{
              top,
              left,
              animationDelay: delay,
            }}
          />
        );
      })}
    </div>
  );
};

export default ParticleBackground;

import ParticleBackground from "./ParticleBackground";

const PageWrapper = ({ children, className = "" }) => {
  return (
    <div
      className={`relative min-h-screen text-white overflow-hidden ${className}`}
    >
      {/* 🌌 Particle Background */}
      <ParticleBackground />

      {/* 🎨 Gradient Background Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0a0a1a,#000)] -z-20" />

      {/* 📦 Page Content */}
      <div className="relative z-20">{children}</div>
    </div>
  );
};

export default PageWrapper;

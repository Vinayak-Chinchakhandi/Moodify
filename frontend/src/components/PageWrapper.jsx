import ParticleBackground from "./ParticleBackground";

const PageWrapper = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_center,#0a0a1a,#000)] text-white overflow-hidden">
      <ParticleBackground />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default PageWrapper;
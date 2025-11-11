import React, { useMemo } from "react";

const ParticleBackground = () => {
  // 🎶 Musical notes & neon colors (generated once)
  const notes = useMemo(() => {
    const symbols = ["🎵", "🎶", "♩", "♪", "♬"];
    const colors = ["#00FFFF", "#FF00FF", "#FFD700", "#00FF9C", "#FF6EC7"];
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      duration: 8 + Math.random() * 6,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[radial-gradient(circle_at_center,#0a0a1a,#000)]">
      {notes.map((n) => (
        <span
          key={n.id}
          style={{
            position: "absolute",
            top: `${n.y}%`,
            left: `${n.x}%`,
            fontSize: "28px",
            color: n.color,
            filter: `drop-shadow(0 0 10px ${n.color})`,
            animation: `floatNotes ${n.duration}s ease-in-out ${n.delay}s infinite`,
            opacity: 0.9,
          }}
        >
          {n.symbol}
        </span>
      ))}

      <style>{`
        @keyframes floatNotes {
          0% { transform: translateY(0px); opacity: 0.7; }
          50% { transform: translateY(-100px) scale(1.1); opacity: 1; }
          100% { transform: translateY(-200px); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default ParticleBackground;








// import React, { useMemo } from "react";

// const ParticleBackground = () => {
//   const particles = useMemo(
//     () =>
//       Array.from({ length: 60 }).map((_, i) => ({
//         id: i,
//         top: Math.random() * 100,
//         left: Math.random() * 100,
//         size: 1 + Math.random() * 3,
//         delay: Math.random() * 5,
//         duration: 5 + Math.random() * 5,
//       })),
//     []
//   );

//   return (
//     <div
//       className="fixed inset-0 pointer-events-none overflow-hidden z-0"
//       style={{ background: "transparent" }}
//     >
//       <style>{`
//         @keyframes float {
//           0% { transform: translateY(0px) scale(1); opacity: 0.3; }
//           50% { transform: translateY(-30px) scale(1.1); opacity: 0.8; }
//           100% { transform: translateY(0px) scale(1); opacity: 0.3; }
//         }
//       `}</style>

//       {particles.map((p) => (
//         <div
//           key={p.id}
//           style={{
//             position: "absolute",
//             top: `${p.top}%`,
//             left: `${p.left}%`,
//             width: `${p.size * 2}px`,
//             height: `${p.size * 2}px`,
//             background:
//               "radial-gradient(circle, rgba(0,255,255,0.9) 0%, rgba(255,0,204,0.7) 80%)",
//             borderRadius: "50%",
//             animation: `float ${p.duration}s ease-in-out infinite`,
//             animationDelay: `${p.delay}s`,
//             filter: "blur(0.5px)",
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// export default ParticleBackground;








// import introVideo from "../assets/intro1.mp4";
// const ParticleBackground = () => {
//   return (
//     <video
//       autoPlay
//       loop
//       muted
//       playsInline
//       className="fixed inset-0 w-full h-full object-cover z-0"
//     >
//       <source src={introVideo} type="video/mp4" />
//     </video>
//   );
// };

// export default ParticleBackground;
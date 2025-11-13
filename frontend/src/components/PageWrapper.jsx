// import React, { useMemo } from "react";

// const PageWrapper = ({ children }) => {
//   // 🎵 Generate notes once per app lifetime (stable background)
//   const notes = useMemo(() => {
//     const symbols = ["🎵", "🎶", "♩", "♪", "♬"];
//     const colors = ["#00FFFF", "#FF00FF", "#FFD700", "#00FF9C", "#FF6EC7"];
//     return Array.from({ length: 20 }).map((_, i) => ({
//       id: i,
//       x: Math.random() * 100,
//       y: Math.random() * 100,
//       color: colors[Math.floor(Math.random() * colors.length)],
//       symbol: symbols[Math.floor(Math.random() * symbols.length)],
//       duration: 18 + Math.random() * 10,
//       delay: Math.random() * 10,
//       driftX: Math.random() * 60 - 30,
//       driftY: Math.random() * 40 - 20,
//       rotate: Math.random() * 30 - 15,
//     }));
//   }, []); // ✅ Empty deps → generated only once

//   return (
//     <div className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden">
//       {/* 🌌 Musical Notes Background */}
//       <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none bg-[radial-gradient(circle_at_center,#0a0a1a,#000)]">
//         {notes.map((n) => (
//           <span
//             key={n.id}
//             style={{
//               position: "absolute",
//               top: `${n.y}%`,
//               left: `${n.x}%`,
//               fontSize: "26px",
//               color: n.color,
//               opacity: 0.85,
//               animation: `floatNote-${n.id} ${n.duration}s ease-in-out ${n.delay}s infinite alternate`,
//             }}
//           >
//             {n.symbol}
//           </span>
//         ))}

//         {/* ✨ Individual Animations */}
//         <style>
//           {notes
//             .map(
//               (n) => `
//               @keyframes floatNote-${n.id} {
//                 0% {
//                   transform: translate(0px, 0px) scale(1) rotate(0deg);
//                   opacity: 0.8;
//                 }
//                 50% {
//                   transform: translate(${n.driftX}px, ${n.driftY}px) scale(1.1) rotate(${n.rotate}deg);
//                   opacity: 1;
//                 }
//                 100% {
//                   transform: translate(${-n.driftX}px, ${-n.driftY}px) scale(1) rotate(${-n.rotate}deg);
//                   opacity: 0.8;
//                 }
//               }
//             `
//             )
//             .join("\n")}
//         </style>
//       </div>

//       {/* ✅ Page Content */}
//       <main className="relative z-10 w-full flex flex-col items-center justify-center">
//         {children}
//       </main>
//     </div>
//   );
// };

// export default PageWrapper;








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
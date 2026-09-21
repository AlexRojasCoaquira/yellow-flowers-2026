import React from "react";

// ============================================================
//  GIRASOL 3D REAL — 5 capas apiladas en translateZ
//  calyx(-10px) / back(-2px) / mid(+8px) / front(+14px) / disc(+20px)
// ============================================================

interface SunflowerProps {
  size?: number;
  id: string;
  tiltX?: number;
  tiltY?: number;
  bloomDelay?: number; // para escalonar el unfurl de capas
}

function Sunflower3D({
  size = 110,
  id,
  tiltX = 0,
  tiltY = 0,
  bloomDelay = 0,
}: SunflowerProps) {
  // Más pétalos, finos y superpuestos: silueta de girasol natural.
  const backCount = 20;
  const midCount = 20;
  const frontCount = 16;
  const backPetals = Array.from(
    { length: backCount },
    (_, i) => (i * 360) / backCount,
  );
  const midPetals = Array.from(
    { length: midCount },
    (_, i) => (i * 360) / midCount + 11.25,
  );
  const frontPetals = Array.from(
    { length: frontCount },
    (_, i) => (i * 360) / frontCount + 7.5,
  );

  // Semillas en espiral de Fibonacci — disco denso natural
  const seeds = Array.from({ length: 61 }, (_, i) => {
    const angle = i * 137.508 * (Math.PI / 180);
    const r = Math.sqrt(i) * 2.7;
    const alpha = Math.max(0.35, 1 - r / 22);
    return {
      cx: Math.cos(angle) * r,
      cy: Math.sin(angle) * r,
      r: i > 38 ? 1.55 : 1.15,
      alpha,
    };
  });

  // Anillo de micro-flósculos dorados (borde del disco)
  const florets = Array.from({ length: 28 }, (_, i) => {
    const a = ((i * 360) / 28) * (Math.PI / 180);
    return { cx: Math.cos(a) * 21.6, cy: Math.sin(a) * 21.6 };
  });

  const sepalAngles = [0, 45, 90, 135, 180, 225, 270, 315];

  const bpId = `bp-${id}`;
  const mpId = `mp-${id}`;
  const fpId = `fp-${id}`;
  const discId = `disc-${id}`;
  const hlId = `hl-${id}`;
  const calyxId = `cal-${id}`;
  const shId = `sh-${id}`;
  const tipId = `tip-${id}`;

  const layerSvgStyle: React.CSSProperties = {
    overflow: "visible",
    display: "block",
    width: "100%",
    height: "100%",
  };

  return (
    <div
      className="sunflower-3d-wrapper"
      style={
        {
          width: size,
          height: size,
          ["--tiltX" as string]: `${tiltX}deg`,
          ["--tiltY" as string]: `${tiltY}deg`,
          ["--bloom" as string]: `${bloomDelay}s`,
        } as React.CSSProperties
      }
    >
      {/* Defs compartidos de la flor (referenciables desde las 5 capas) */}
      <svg
        width="0"
        height="0"
        style={{ position: "absolute", width: 0, height: 0 }}
        aria-hidden="true"
      >
        <defs>
          {/* Traseros: ocre profundo → dorado (curvatura cóncava sombreada) */}
          <linearGradient id={bpId} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#7c2d12" />
            <stop offset="28%" stopColor="#92400e" />
            <stop offset="60%" stopColor="#b45309" />
            <stop offset="85%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          {/* Intermedios: degradado de luz con nervadura */}
          <linearGradient id={mpId} x1="20%" y1="100%" x2="80%" y2="0%">
            <stop offset="0%" stopColor="#a16207" />
            <stop offset="32%" stopColor="#ca8a04" />
            <stop offset="62%" stopColor="#eab308" />
            <stop offset="85%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#fef9c3" />
          </linearGradient>
          {/* Frontales: amarillo sol vivo con punta luminosa */}
          <linearGradient id={fpId} x1="20%" y1="100%" x2="80%" y2="0%">
            <stop offset="0%" stopColor="#ca8a04" />
            <stop offset="30%" stopColor="#facc15" />
            <stop offset="62%" stopColor="#fde047" />
            <stop offset="88%" stopColor="#f9dc55" />
            <stop offset="100%" stopColor="#fff3a6" />
          </linearGradient>
          {/* Brillo especular de punta viva */}
          <linearGradient id={tipId} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
          </linearGradient>
          {/* Disco: esfera marrón con luz cenital cálida */}
          <radialGradient id={discId} cx="35%" cy="30%" r="68%">
            <stop offset="0%" stopColor="#92400e" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#451a03" />
            <stop offset="65%" stopColor="#3f2612" />
            <stop offset="88%" stopColor="#241307" />
            <stop offset="100%" stopColor="#120a05" />
          </radialGradient>
          {/* Luz volumétrica esférica sobre el disco */}
          <radialGradient id={hlId} cx="38%" cy="30%" r="45%">
            <stop offset="0%" stopColor="#fde68a" stopOpacity="0.5" />
            <stop offset="45%" stopColor="#fbbf24" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </radialGradient>
          {/* Cáliz verde */}
          <radialGradient id={calyxId} cx="50%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="45%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#14532d" />
          </radialGradient>
          <filter id={shId} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="1"
              dy="4"
              stdDeviation="3"
              floodColor="#451a03"
              floodOpacity="0.32"
            />
          </filter>
        </defs>
      </svg>

      {/* CAPA 0 — base de sépalos verdes (calyx), al fondo */}
      <div
        className="sf-layer sf-calyx"
        style={{ transform: "translateZ(-10px)" }}
      >
        <svg viewBox="-72 -72 144 144" style={layerSvgStyle}>
          {sepalAngles.map((deg, i) => (
            <path
              key={`calyx-${i}`}
              d="M 0 0 C -5.5 8, -6.5 19, 0 26 C 6.5 19, 5.5 8, 0 0 Z"
              fill={`url(#${calyxId})`}
              transform={`rotate(${deg})`}
              opacity="0.85"
            />
          ))}
          <circle
            cx="0"
            cy="0"
            r="15"
            fill={`url(#${calyxId})`}
            opacity="0.75"
          />
        </svg>
      </div>

      {/* CAPA 1 — pétalos traseros ocre/dorado, curvatura cóncava */}
      <div
        className="sf-layer sf-back"
        style={{ transform: "translateZ(-2px)" }}
      >
        <svg viewBox="-72 -72 144 144" style={layerSvgStyle}>
          <g filter={`url(#${shId})`}>
            {backPetals.map((deg, i) => (
              <g
                key={`bp-${i}`}
                transform={`rotate(${deg}) scale(${i % 3 === 0 ? 0.96 : i % 3 === 1 ? 1.02 : 0.99})`}
              >
                {/* <path
                  d="M -9 -16 C -13 -31, -12 -51, -4 -67 C -2 -71, 2 -71, 4 -67 C 12 -51, 13 -31, 9 -16 Z"
                  fill={`url(#${bpId})`}
                  opacity="0.94"
                /> */}
                <path
                  d="M 0 -20 C -1.5 -34, -1.5 -52, 0 -64"
                  stroke="#451a03"
                  strokeWidth="1.4"
                  strokeOpacity="0.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 3.5 -24 C 5 -36, 5 -50, 3 -60"
                  stroke="#fcd34d"
                  strokeWidth="1"
                  strokeOpacity="0.35"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* CAPA 2 — pétalos intermedios con nervadura central y degradado de luz */}
      <div className="sf-layer sf-mid" style={{ transform: "translateZ(8px)" }}>
        <svg viewBox="-72 -72 144 144" style={layerSvgStyle}>
          <g filter={`url(#${shId})`}>
            {midPetals.map((deg, i) => (
              <g
                key={`mp-${i}`}
                transform={`rotate(${deg}) scale(${i % 4 === 0 ? 0.97 : 1})`}
              >
                <path
                  d="M -7.5 -18 C -10.5 -34, -9.5 -52, 0 -64 C 9.5 -52, 10.5 -34, 7.5 -18 Z"
                  fill={`url(#${mpId})`}
                  opacity="0.96"
                />
                {/* nervadura central */}
                <line
                  x1="0"
                  y1="-21"
                  x2="0"
                  y2="-58"
                  stroke="#92400e"
                  strokeWidth="1.3"
                  strokeOpacity="0.55"
                  strokeLinecap="round"
                />
                {/* filete de luz junto a la nervadura */}
                <line
                  x1="1.6"
                  y1="-24"
                  x2="1.6"
                  y2="-54"
                  stroke="#fef9c3"
                  strokeWidth="0.9"
                  strokeOpacity="0.6"
                  strokeLinecap="round"
                />
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* CAPA 3 — pétalos frontales, puntas vivas + brillo especular amarillo sol */}
      <div
        className="sf-layer sf-front"
        style={{ transform: "translateZ(14px)" }}
      >
        <svg viewBox="-72 -72 144 144" style={layerSvgStyle}>
          <g filter={`url(#${shId})`}>
            {frontPetals.map((deg, i) => (
              <g
                key={`fp-${i}`}
                transform={`rotate(${deg}) scale(${i % 3 === 0 ? 0.96 : i % 3 === 1 ? 1.01 : 0.98})`}
              >
                <path
                  d="M -6.5 -19 C -9 -34, -7.5 -53, 0 -65 C 7.5 -53, 9 -34, 6.5 -19 Z"
                  fill={`url(#${fpId})`}
                />
                {/* punta viva especular */}
                <ellipse
                  cx="0"
                  cy="-59"
                  rx="2.2"
                  ry="4.2"
                  fill={`url(#${tipId})`}
                  opacity="0.48"
                />
                {/* filo de luz en el borde */}
                <path
                  d="M 0 -64 C 3 -58, 5 -46, 4.5 -34"
                  stroke="#ffffff"
                  strokeWidth="1"
                  strokeOpacity="0.35"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* CAPA 4 — disco central convexo abombado, translateZ al frente */}
      <div
        className="sf-layer sf-disc"
        style={{ transform: "translateZ(22px)" }}
      >
        <svg viewBox="-72 -72 144 144" style={layerSvgStyle}>
          {/* sombra arrojada del disco sobre pétalos */}
          <circle cx="0" cy="1.5" r="27" fill="rgba(30,15,0,0.28)" />
          {/* disco principal */}
          <circle cx="0" cy="0" r="24" fill={`url(#${discId})`} />
          {/* anillo de micro-flósculos dorados */}
          {florets.map((f, i) => (
            <circle
              key={`fl-${i}`}
              cx={f.cx}
              cy={f.cy}
              r={i % 2 === 0 ? 1.7 : 1.3}
              fill={
                i % 3 === 0 ? "#fbbf24" : i % 3 === 1 ? "#f59e0b" : "#b45309"
              }
              opacity="0.9"
            />
          ))}
          {/* semillas en espiral de Fibonacci */}
          {seeds.map((s, idx) => (
            <circle
              key={`s-${idx}`}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              fill={idx % 2 === 0 ? "#2a1206" : "#78350f"}
              opacity={s.alpha}
            />
          ))}
          {/* luz volumétrica esférica */}
          <circle cx="0" cy="0" r="24" fill={`url(#${hlId})`} />
          {/* aro de luz de borde (rim) arriba-izquierda */}
          <path
            d="M -16 -14 A 21.5 21.5 0 0 1 12 -18"
            stroke="#fde68a"
            strokeWidth="1.6"
            strokeOpacity="0.55"
            fill="none"
            strokeLinecap="round"
          />
          {/* punto brillante focal */}
          <ellipse
            cx="-7"
            cy="-8"
            rx="5"
            ry="3.2"
            fill="rgba(253,230,138,0.32)"
          />
          <ellipse
            cx="-7"
            cy="-8"
            rx="2"
            ry="1.2"
            fill="rgba(255,255,255,0.5)"
          />
        </svg>
      </div>
    </div>
  );
}

// ============================================================
//  DATOS DE LOS 10 GIRASOLES — 3 niveles de profundidad Z
//  Posterior Z15 Y[-150,-175] / Medio Z45 Y[-110,-135] / Frontal Z75 Y[-70,-95]
// ============================================================

interface LeafDef {
  blade: string;
  vein: string;
}

interface FlowerData {
  id: number;
  key: string;
  x: number;
  y: number;
  z: number;
  rotZ: number;
  tiltX: number;
  tiltY: number;
  size: number;
  stemD: string;
  stemLen: number;
  leaves: LeafDef[];
  growDelay: number;
  bloomDelay: number;
  swayClass: string;
  swayDur: number;
  swayDelay: number;
}

const FLOWERS: FlowerData[] = [
  // ── NIVEL POSTERIOR (Z 15) — 3 flores altas de fondo ──
  {
    id: 1,
    key: "f1",
    x: -78,
    y: -158,
    z: 15,
    rotZ: -18,
    tiltX: 14,
    tiltY: -16,
    size: 96,
    stemD: "M 0 58 C -15 25, -38 -60, -78 -130",
    stemLen: 215,
    leaves: [
      {
        blade: "M -28 -8 C -50 -24, -60 0, -40 7 C -28 11, -26 -1, -28 -8 Z",
        vein: "M -28 -6 C -36 -2, -44 1, -50 -3",
      },
      {
        blade:
          "M -50 -62 C -72 -77, -80 -52, -60 -47 C -48 -44, -46 -55, -50 -62 Z",
        vein: "M -50 -60 C -57 -56, -64 -54, -70 -58",
      },
    ],
    growDelay: 0.4,
    bloomDelay: 0.92,
    swayClass: "sway-1",
    swayDur: 4.5,
    swayDelay: 0,
  },
  {
    id: 2,
    key: "f2",
    x: 0,
    y: -172,
    z: 15,
    rotZ: 0,
    tiltX: 10,
    tiltY: 0,
    size: 108,
    stemD: "M 0 58 C 0 15, 0 -70, 0 -142",
    stemLen: 205,
    leaves: [
      {
        blade: "M 0 -34 C -25 -54, -30 -26, -12 -20 C -4 -17, 0 -28, 0 -34 Z",
        vein: "M 0 -32 C -8 -28, -15 -26, -22 -30",
      },
      {
        blade: "M 0 -84 C 22 -104, 26 -77, 10 -71 C 2 -68, 0 -77, 0 -84 Z",
        vein: "M 0 -82 C 7 -78, 13 -76, 19 -80",
      },
    ],
    growDelay: 0.1,
    bloomDelay: 0.68,
    swayClass: "sway-2",
    swayDur: 3.9,
    swayDelay: 1.2,
  },
  {
    id: 3,
    key: "f3",
    x: 78,
    y: -158,
    z: 15,
    rotZ: 18,
    tiltX: 14,
    tiltY: 16,
    size: 96,
    stemD: "M 0 58 C 15 25, 38 -60, 78 -130",
    stemLen: 215,
    leaves: [
      {
        blade: "M 28 -8 C 50 -24, 60 0, 40 7 C 28 11, 26 -1, 28 -8 Z",
        vein: "M 28 -6 C 36 -2, 44 1, 50 -3",
      },
      {
        blade: "M 50 -62 C 72 -77, 80 -52, 60 -47 C 48 -44, 46 -55, 50 -62 Z",
        vein: "M 50 -60 C 57 -56, 64 -54, 70 -58",
      },
    ],
    growDelay: 0.4,
    bloomDelay: 0.92,
    swayClass: "sway-3",
    swayDur: 4.3,
    swayDelay: 0.6,
  },

  // ── NIVEL MEDIO (Z 45) — 4 flores, corazón del ramo ──
  {
    id: 4,
    key: "f4",
    x: -58,
    y: -128,
    z: 45,
    rotZ: -12,
    tiltX: 8,
    tiltY: -20,
    size: 110,
    stemD: "M 0 58 C -10 25, -32 -35, -58 -100",
    stemLen: 180,
    leaves: [
      {
        blade: "M -24 -2 C -45 -18, -54 6, -33 13 C -21 17, -21 5, -24 -2 Z",
        vein: "M -24 0 C -31 4, -39 7, -46 4",
      },
      {
        blade:
          "M -43 -52 C -63 -66, -71 -42, -51 -36 C -40 -32, -39 -44, -43 -52 Z",
        vein: "M -43 -50 C -50 -46, -57 -44, -63 -48",
      },
    ],
    growDelay: 0.25,
    bloomDelay: 0.8,
    swayClass: "sway-4",
    swayDur: 4.1,
    swayDelay: 0.4,
  },
  {
    id: 5,
    key: "f5",
    x: 58,
    y: -128,
    z: 45,
    rotZ: 12,
    tiltX: 8,
    tiltY: 20,
    size: 110,
    stemD: "M 0 58 C 10 25, 32 -35, 58 -100",
    stemLen: 180,
    leaves: [
      {
        blade: "M 24 -2 C 45 -18, 54 6, 33 13 C 21 17, 21 5, 24 -2 Z",
        vein: "M 24 0 C 31 4, 39 7, 46 4",
      },
      {
        blade: "M 43 -52 C 63 -66, 71 -42, 51 -36 C 40 -32, 39 -44, 43 -52 Z",
        vein: "M 43 -50 C 50 -46, 57 -44, 63 -48",
      },
    ],
    growDelay: 0.25,
    bloomDelay: 0.8,
    swayClass: "sway-5",
    swayDur: 4.2,
    swayDelay: 0.8,
  },
  {
    id: 6,
    key: "f6",
    x: -24,
    y: -132,
    z: 45,
    rotZ: -5,
    tiltX: 5,
    tiltY: -8,
    size: 118,
    stemD: "M 0 58 C -5 15, -13 -45, -24 -102",
    stemLen: 172,
    leaves: [
      {
        blade: "M -13 -16 C -35 -34, -43 -8, -23 -2 C -11 2, -11 -9, -13 -16 Z",
        vein: "M -13 -14 C -20 -10, -28 -7, -35 -11",
      },
    ],
    growDelay: 0.15,
    bloomDelay: 0.7,
    swayClass: "sway-6",
    swayDur: 4.0,
    swayDelay: 1.6,
  },
  {
    id: 7,
    key: "f7",
    x: 24,
    y: -132,
    z: 45,
    rotZ: 5,
    tiltX: 5,
    tiltY: 8,
    size: 118,
    stemD: "M 0 58 C 5 15, 13 -45, 24 -102",
    stemLen: 172,
    leaves: [
      {
        blade: "M 13 -16 C 35 -34, 43 -8, 23 -2 C 11 2, 11 -9, 13 -16 Z",
        vein: "M 13 -14 C 20 -10, 28 -7, 35 -11",
      },
    ],
    growDelay: 0.18,
    bloomDelay: 0.72,
    swayClass: "sway-7",
    swayDur: 3.8,
    swayDelay: 2.0,
  },

  // ── NIVEL FRONTAL (Z 75) — 3 flores que enmarcan la caja ──
  {
    id: 8,
    key: "f8",
    x: -82,
    y: -88,
    z: 75,
    rotZ: -28,
    tiltX: -10,
    tiltY: -26,
    size: 100,
    stemD: "M 0 58 C -20 38, -52 12, -80 -60",
    stemLen: 150,
    leaves: [
      {
        blade: "M -38 24 C -60 11, -68 34, -46 40 C -33 44, -34 31, -38 24 Z",
        vein: "M -38 26 C -45 30, -52 33, -58 30",
      },
    ],
    growDelay: 0.35,
    bloomDelay: 0.9,
    swayClass: "sway-8",
    swayDur: 4.7,
    swayDelay: 0.2,
  },
  {
    id: 9,
    key: "f9",
    x: 0,
    y: -92,
    z: 75,
    rotZ: 0,
    tiltX: -6,
    tiltY: 0,
    size: 122,
    stemD: "M 0 58 C 0 28, 0 -12, 0 -62",
    stemLen: 122,
    leaves: [
      {
        blade: "M 0 8 C 22 -10, 28 14, 8 20 C -2 23, 0 13, 0 8 Z",
        vein: "M 0 10 C 7 12, 13 14, 18 11",
      },
      {
        blade: "M 0 -22 C -24 -39, -28 -12, -10 -6 C -2 -3, 0 -14, 0 -22 Z",
        vein: "M 0 -20 C -7 -16, -14 -13, -20 -17",
      },
    ],
    growDelay: 0.05,
    bloomDelay: 0.6,
    swayClass: "sway-9",
    swayDur: 3.6,
    swayDelay: 0,
  },
  {
    id: 10,
    key: "f10",
    x: 82,
    y: -88,
    z: 75,
    rotZ: 28,
    tiltX: -10,
    tiltY: 26,
    size: 100,
    stemD: "M 0 58 C 20 38, 52 12, 80 -60",
    stemLen: 150,
    leaves: [
      {
        blade: "M 38 24 C 60 11, 68 34, 46 40 C 33 44, 34 31, 38 24 Z",
        vein: "M 38 26 C 45 30, 52 33, 58 30",
      },
    ],
    growDelay: 0.35,
    bloomDelay: 0.9,
    swayClass: "sway-10",
    swayDur: 4.8,
    swayDelay: 0.4,
  },
];

// ============================================================
//  COMPONENTE PRINCIPAL — Ramo de 10 Girasoles 3D
// ============================================================
export function SunflowerBouquet() {
  return (
    <div className="sunflower-bouquet-container">
      {/* ── SVG GLOBAL: tallos + hojas cordadas con nervaduras + lazo ── */}
      <svg
        className="bouquet-stems-svg"
        viewBox="-120 -185 240 250"
        style={{ overflow: "hidden" }}
      >
        <defs>
          <linearGradient id="stemGrad3d" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14532d" />
            <stop offset="30%" stopColor="#16a34a" />
            <stop offset="55%" stopColor="#4ade80" />
            <stop offset="75%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
          <linearGradient id="leafGrad3d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#166534" />
            <stop offset="45%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
        </defs>

        {/* Hojas cordadas con nervadura central */}
        {FLOWERS.map((f) => (
          <g
            key={`leaves-${f.key}`}
            className="stem-leaves"
            style={{ animationDelay: `${f.growDelay + 0.3}s` }}
          >
            {f.leaves.map((leaf, li) => (
              <g key={`leaf-${f.key}-${li}`}>
                <path
                  d={leaf.blade}
                  fill="url(#leafGrad3d)"
                  stroke="#14532d"
                  strokeWidth="0.8"
                  filter="drop-shadow(0 2px 5px rgba(0,0,0,0.22))"
                />
                {/* nervadura central + destello */}
                <path
                  d={leaf.vein}
                  stroke="#86efac"
                  strokeWidth="1"
                  strokeOpacity="0.75"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            ))}
          </g>
        ))}

        {/* Tallos con animación de crecimiento */}
        {FLOWERS.map((f) => (
          <path
            key={`stem-${f.key}`}
            d={f.stemD}
            fill="none"
            stroke="url(#stemGrad3d)"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stem-grow"
            style={
              {
                "--stem-len": f.stemLen,
                animationDelay: `${f.growDelay}s`,
              } as React.CSSProperties
            }
            filter="drop-shadow(0 3px 7px rgba(10,35,12,0.28))"
          />
        ))}

        {/* Lazo dorado que ata el ramo en la base interior */}
        <g transform="translate(0, 56)">
          <ellipse cx="0" cy="0" rx="22" ry="7.5" fill="#92400e" />
          <ellipse cx="0" cy="0" rx="18" ry="5.5" fill="#d97706" />
          <ellipse cx="0" cy="0" rx="14" ry="3.5" fill="#fbbf24" />
          <path
            d="M 0 -2 C -16 -14, -22 4, -4 6 C -1 7, 0 2, 0 -2 Z"
            fill="#f59e0b"
            stroke="#b45309"
            strokeWidth="0.8"
            opacity="0.9"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))"
          />
          <path
            d="M 0 -2 C 16 -14, 22 4, 4 6 C 1 7, 0 2, 0 -2 Z"
            fill="#d97706"
            stroke="#92400e"
            strokeWidth="0.8"
            opacity="0.9"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))"
          />
          <ellipse cx="0" cy="2" rx="4" ry="3" fill="#b45309" />
          <ellipse cx="0" cy="2" rx="2" ry="1.5" fill="#fbbf24" opacity="0.6" />
        </g>
      </svg>

      {/* ── CABEZAS: nodo de posición/bloom + sway interior + flor 3D ── */}
      <div className="sunflower-heads-layer">
        {FLOWERS.map((f) => (
          <div
            key={`fnode-${f.key}`}
            className="sunflower-node"
            style={
              {
                "--tx": `${f.x}px`,
                "--ty": `${f.y}px`,
                "--tz": `${f.z}px`,
                "--rz": `${f.rotZ}deg`,
                // Cada flor espera su turno y empieza desde la misma base.
                animationDelay: `${f.growDelay + 0.45}s`,
              } as React.CSSProperties
            }
          >
            <div
              className={`sunflower-sway ${f.swayClass}`}
              style={
                {
                  animationDuration: `${f.swayDur}s`,
                  animationDelay: `${f.bloomDelay + 0.85 + f.swayDelay * 0.3}s`,
                } as React.CSSProperties
              }
            >
              <Sunflower3D
                size={f.size}
                id={f.key}
                tiltX={f.tiltX}
                tiltY={f.tiltY}
                bloomDelay={f.growDelay + 0.7}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

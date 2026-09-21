import { useState, useRef, useEffect } from "react";
import "./App.css";

function useTransparentImage(src: string) {
  const [dataUrl, setDataUrl] = useState<string>(src);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i],
          g = d[i + 1],
          b = d[i + 2];
        if (r > 240 && g > 240 && b > 240) {
          d[i + 3] = 0;
        } else if (r > 225 && g > 225 && b > 225) {
          const avg = (r + g + b) / 3;
          const factor = Math.max(0, (240 - avg) / 15);
          d[i + 3] = Math.min(255, Math.floor(d[i + 3] * factor));
        }
      }
      ctx.putImageData(imgData, 0, 0);
      setDataUrl(canvas.toDataURL("image/png"));
    };
  }, [src]);

  return dataUrl;
}

export function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotX, setRotX] = useState(-18);
  const [rotY, setRotY] = useState(-25);
  const [isDragging, setIsDragging] = useState(false);
  const bouquetSrc = useTransparentImage("/ramo-flores.png");

  const dragStartRef = useRef<{
    startY: number;
    startRotX: number;
    moved: boolean;
  }>({
    startY: 0,
    startRotX: -18,
    moved: false,
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isSpinning) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragStartRef.current = {
      startY: e.clientY,
      startRotX: rotX,
      moved: false,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isSpinning) return;
    const deltaY = e.clientY - dragStartRef.current.startY;
    if (Math.abs(deltaY) > 4) {
      dragStartRef.current.moved = true;
    }
    setRotX(dragStartRef.current.startRotX - deltaY * 0.6);
  };

  const handlePointerUp = () => {
    if (!dragStartRef.current.moved && !isSpinning) {
      if (!isOpen) {
        // Al hacer clic, gira 10 veces a la derecha rápidamente y aterriza recta (0° en Y, base completamente horizontal)
        setIsSpinning(true);
        setRotY((prev) => prev + 3625);
        setRotX(-10);
        setTimeout(() => {
          setIsSpinning(false);
          setIsOpen(true);
        }, 1400);
      } else {
        // Al cerrarse, la caja vuelve suavemente a su posición original (-25° en Y, -18° en X)
        setIsOpen(false);
        setRotY((prev) => prev - 25);
        setRotX(-18);
      }
    }
    setIsDragging(false);
  };

  return (
    <main className="box-page">
      <div
        className={`box-bounce-track ${isOpen || isSpinning ? "straight" : ""}`}
      >
        <div
          className={`box-scene ${isOpen ? "open" : ""} ${isDragging ? "dragging" : ""} ${isSpinning ? "spinning" : ""}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => setIsDragging(false)}
          style={{
            transform: `scale(1.45) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transition: isDragging
              ? "none"
              : isSpinning
                ? "transform 1.4s cubic-bezier(0.25, 0.05, 0.2, 1)"
                : "transform 0.8s cubic-bezier(0.34, 1.15, 0.64, 1)",
          }}
          title="Arrastra en vertical para inclinar en el eje X, o haz clic para abrir"
        >
          {/* Sombra realista en el suelo */}
          <div className="box-floor-shadow" />

          {/* Contenedor central 3D */}
          <div className="box-3d">
            {/* Ramo de flores amarillas que sale de la caja */}
            <div className="box-bouquet">
              <img
                src={bouquetSrc}
                alt="Ramo de Flores Amarillas"
                className="bouquet-img"
              />
            </div>

            {/* Sorpresa interior: Carta temática de Flores Amarillas */}
            <div className="box-surprise">
              <div className="card-inner-frame" />
              <div className="card-date-badge">21 de Septiembre</div>
              <p className="card-main-quote">
                «Nunca te dejaré ser espectadora»
              </p>
            </div>

            {/* Cuerpo cúbico de la caja */}
            <div className="box-body-3d">
              <div className="box-face face-front">
                <div className="body-ribbon-v" />
                {/* Cuerda y etiqueta colgante */}
                {/* <div className="tag-cord" /> */}
                <div className="gift-tag">
                  <span className="tag-title">¡SORPRESA!</span>
                  <span className="tag-subtitle">¡Para Alguien Especial!</span>
                </div>
              </div>
              <div className="box-face face-back">
                <div className="body-ribbon-v" />
              </div>
              <div className="box-face face-left">
                <div className="body-ribbon-v" />
              </div>
              <div className="box-face face-right">
                <div className="body-ribbon-v" />
              </div>
              <div className="box-face face-bottom">
                <div className="body-ribbon-v" />
                <div className="body-ribbon-h" />
              </div>
            </div>

            {/* Tapa 3D con moño de satén de alta fidelidad */}
            <div className="box-lid-3d">
              {/* Techo de la tapa con cinta cruzada */}
              <div className="lid-face lid-top">
                <div className="lid-ribbon-v" />
                <div className="lid-ribbon-h" />
              </div>

              {/* Faldones laterales de la tapa */}
              <div className="lid-face lid-front">
                <div className="lid-skirt-ribbon" />
              </div>
              <div className="lid-face lid-back">
                <div className="lid-skirt-ribbon" />
              </div>
              <div className="lid-face lid-left">
                <div className="lid-skirt-ribbon" />
              </div>
              <div className="lid-face lid-right">
                <div className="lid-skirt-ribbon" />
              </div>

              {/* Moño de satén realista y volumétrico estilo boutique */}
              <div className="lid-bow-3d">
                <svg
                  className="satin-bow-svg"
                  viewBox="0 0 240 105"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    {/* Sombra de contacto difusa sobre la tapa */}
                    <radialGradient
                      id="bowShadowGrad"
                      cx="50%"
                      cy="50%"
                      r="50%"
                    >
                      <stop
                        offset="0%"
                        stopColor="#4a1520"
                        stopOpacity="0.45"
                      />
                      <stop
                        offset="55%"
                        stopColor="#7a3440"
                        stopOpacity="0.2"
                      />
                      <stop offset="100%" stopColor="#7a3440" stopOpacity="0" />
                    </radialGradient>

                    {/* Satén bucle izquierdo: brillo suave a profundo */}
                    <linearGradient
                      id="leftLoopGrad"
                      x1="10%"
                      y1="10%"
                      x2="90%"
                      y2="85%"
                    >
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="14%" stopColor="#fae4e8" />
                      <stop offset="35%" stopColor="#e3a1ad" />
                      <stop offset="65%" stopColor="#c5707f" />
                      <stop offset="90%" stopColor="#9a4352" />
                      <stop offset="100%" stopColor="#7a2a37" />
                    </linearGradient>

                    {/* Cavidad interior izquierda: sombra profunda de seda enrollada */}
                    <linearGradient
                      id="leftCavityGrad"
                      x1="15%"
                      y1="15%"
                      x2="90%"
                      y2="85%"
                    >
                      <stop offset="0%" stopColor="#300d14" />
                      <stop offset="40%" stopColor="#631e2a" />
                      <stop offset="75%" stopColor="#964452" />
                      <stop offset="100%" stopColor="#be707f" />
                    </linearGradient>

                    {/* Satén bucle derecho: iluminación coherente */}
                    <linearGradient
                      id="rightLoopGrad"
                      x1="90%"
                      y1="10%"
                      x2="10%"
                      y2="85%"
                    >
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="14%" stopColor="#fae4e8" />
                      <stop offset="35%" stopColor="#e3a1ad" />
                      <stop offset="65%" stopColor="#c5707f" />
                      <stop offset="90%" stopColor="#9a4352" />
                      <stop offset="100%" stopColor="#7a2a37" />
                    </linearGradient>

                    {/* Cavidad interior derecha */}
                    <linearGradient
                      id="rightCavityGrad"
                      x1="85%"
                      y1="15%"
                      x2="10%"
                      y2="85%"
                    >
                      <stop offset="0%" stopColor="#300d14" />
                      <stop offset="40%" stopColor="#631e2a" />
                      <stop offset="75%" stopColor="#964452" />
                      <stop offset="100%" stopColor="#be707f" />
                    </linearGradient>

                    {/* Nudo central: brillo cilíndrico de satén con reflejo nítido */}
                    <linearGradient
                      id="knotGrad"
                      x1="0%"
                      y1="20%"
                      x2="100%"
                      y2="30%"
                    >
                      <stop offset="0%" stopColor="#70222e" />
                      <stop offset="20%" stopColor="#b2616f" />
                      <stop offset="42%" stopColor="#f8d6dc" />
                      <stop offset="50%" stopColor="#ffffff" />
                      <stop offset="60%" stopColor="#f2b2bd" />
                      <stop offset="80%" stopColor="#a35160" />
                      <stop offset="100%" stopColor="#611723" />
                    </linearGradient>

                    {/* Brillo especular en la cresta superior del bucle */}
                    <linearGradient
                      id="crestSheen"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                      <stop
                        offset="20%"
                        stopColor="#ffffff"
                        stopOpacity="0.95"
                      />
                      <stop
                        offset="75%"
                        stopColor="#ffffff"
                        stopOpacity="0.95"
                      />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>

                    {/* Filtro de sombra realista multicapa */}
                    <filter
                      id="ribbonShadow"
                      x="-20%"
                      y="-20%"
                      width="140%"
                      height="140%"
                    >
                      <feDropShadow
                        dx="0"
                        dy="5"
                        stdDeviation="4.5"
                        floodColor="#4a1520"
                        floodOpacity="0.36"
                      />
                    </filter>
                  </defs>

                  {/* 1. Sombra de contacto sobre el plano de la tapa */}
                  <ellipse
                    cx="120"
                    cy="92"
                    rx="90"
                    ry="12"
                    fill="url(#bowShadowGrad)"
                  />

                  {/* 2. Cavidades internas (el fondo interior oscuro y sedoso visible a través del bucle) */}
                  <g filter="url(#ribbonShadow)">
                    {/* Interior bucle izquierdo */}
                    <path
                      d="M 112,78 C 100,58 84,44 62,40 C 44,38 34,50 42,66 C 52,78 82,84 112,82 Z"
                      fill="url(#leftCavityGrad)"
                    />
                    {/* Interior bucle derecho */}
                    <path
                      d="M 128,78 C 140,58 156,44 178,40 C 196,38 206,50 198,66 C 188,78 158,84 128,82 Z"
                      fill="url(#rightCavityGrad)"
                    />

                    {/* 3. Bandas frontales de cinta de satén con gran volumen y porte */}
                    {/* Bucle izquierdo */}
                    <path
                      d="M 112,83 C 86,90 48,88 28,72 C 10,57 8,34 26,18 C 44,4 74,4 98,22 C 110,32 116,56 113,71 C 110,54 100,36 88,28 C 70,16 48,16 36,28 C 22,40 22,54 36,66 C 52,78 82,80 112,79 Z"
                      fill="url(#leftLoopGrad)"
                      fillRule="evenodd"
                    />

                    {/* Bucle derecho */}
                    <path
                      d="M 128,83 C 154,90 192,88 212,72 C 230,57 232,34 214,18 C 196,4 166,4 142,22 C 130,32 124,56 127,71 C 130,54 140,36 152,28 C 170,16 192,16 204,28 C 218,40 218,54 204,66 C 188,78 158,80 128,79 Z"
                      fill="url(#rightLoopGrad)"
                      fillRule="evenodd"
                    />
                  </g>

                  {/* 4. Brillo especular deslumbrante en la cresta superior de los bucles */}
                  <path
                    d="M 22,44 C 12,28 26,14 50,7 C 72,1 94,12 108,26"
                    stroke="url(#crestSheen)"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 218,44 C 228,28 214,14 190,7 C 168,1 146,12 132,26"
                    stroke="url(#crestSheen)"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* 5. Pliegues de inserción y fruncido hacia el nudo */}
                  <path
                    d="M 106,58 C 102,66 102,74 105,80"
                    stroke="#501621"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    opacity="0.45"
                    fill="none"
                  />
                  <path
                    d="M 134,58 C 138,66 138,74 135,80"
                    stroke="#501621"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    opacity="0.45"
                    fill="none"
                  />

                  {/* 6. Nudo central amplio, cilíndrico y elegante */}
                  <g filter="url(#ribbonShadow)">
                    <path
                      d="M 104,68 C 104,63 111,61 120,61 C 129,61 136,63 136,68 C 137,76 137,84 136,91 C 136,95 129,97 120,97 C 111,97 104,95 104,91 C 103,84 103,76 104,68 Z"
                      fill="url(#knotGrad)"
                    />
                    {/* Hendidura central suave del nudo */}
                    <path
                      d="M 120,63 L 120,95"
                      stroke="#501621"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      opacity="0.38"
                    />
                    {/* Brillo superior en el reborde del nudo */}
                    <path
                      d="M 108,64 C 113,62 127,62 132,64"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.92"
                      fill="none"
                    />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;

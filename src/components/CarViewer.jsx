import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { carModels, paintFinishes } from "../assets/data";
import LoadingFallback from "./LoadingFallback";
import CarModel, { PlaceholderCar } from "./CarModel";

const defaultBodyColor = "#eef3e9";

const defaultPaint = {
  ...paintFinishes[0],
  color: defaultBodyColor,
  finishId: paintFinishes[0].id,
};

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  const normalized =
    value.length === 3
      ? value
          .split("")
          .map((character) => character + character)
          .join("")
      : value.padEnd(6, "0").slice(0, 6);
  const number = Number.parseInt(normalized, 16);

  return {
    r: (number >> 16) & 255,
    g: (number >> 8) & 255,
    b: number & 255,
  };
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b]
    .map((value) => Math.round(value).toString(16).padStart(2, "0"))
    .join("")}`;
}

function rgbToHsv({ r, g, b }) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let h = 0;

  if (delta !== 0) {
    if (max === red) h = ((green - blue) / delta) % 6;
    if (max === green) h = (blue - red) / delta + 2;
    if (max === blue) h = (red - green) / delta + 4;
    h *= 60;
  }

  return {
    h: h < 0 ? h + 360 : h,
    s: max === 0 ? 0 : delta / max,
    v: max,
  };
}

function hsvToRgb({ h, s, v }) {
  const chroma = v * s;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - chroma;
  const [red, green, blue] =
    h < 60
      ? [chroma, x, 0]
      : h < 120
        ? [x, chroma, 0]
        : h < 180
          ? [0, chroma, x]
          : h < 240
            ? [0, x, chroma]
            : h < 300
              ? [x, 0, chroma]
              : [chroma, 0, x];

  return {
    r: (red + m) * 255,
    g: (green + m) * 255,
    b: (blue + m) * 255,
  };
}

function colorToHsv(color) {
  return rgbToHsv(hexToRgb(color || "#ffffff"));
}

export default function CarViewer() {
  const [selectedModelId, setSelectedModelId] = useState(carModels[0].id);
  const [paintByModel, setPaintByModel] = useState(() =>
    Object.fromEntries(carModels.map((model) => [model.id, defaultPaint])),
  );
  const [availableModels, setAvailableModels] = useState({});
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [isPaintPanelOpen, setIsPaintPanelOpen] = useState(false);
  const [lightPreset, setLightPreset] = useState("daylight");

  const selectedModel = useMemo(
    () => carModels.find((model) => model.id === selectedModelId) || carModels[0],
    [selectedModelId],
  );
  const selectedPaint = paintByModel[selectedModelId] || defaultPaint;
  const activeFinish =
    paintFinishes.find((finish) => finish.id === selectedPaint.finishId) || paintFinishes[0];
  const selectedColorHsv = colorToHsv(selectedPaint.color);
  const hueColor = rgbToHex(hsvToRgb({ h: selectedColorHsv.h, s: 1, v: 1 }));
  const modelStatus = availableModels[selectedModel.path];
  const hasModelFile = modelStatus === true;

  useEffect(() => {
    let cancelled = false;

    fetch(selectedModel.path, { method: "HEAD" })
      .then((response) => {
        const contentType = response.headers.get("content-type") || "";
        const isModelResponse =
          response.ok && !contentType.toLowerCase().includes("text/html");

        if (!cancelled) {
          setAvailableModels((current) => ({
            ...current,
            [selectedModel.path]: isModelResponse,
          }));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAvailableModels((current) => ({
            ...current,
            [selectedModel.path]: false,
          }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedModel.path]);

  useEffect(() => {
    RectAreaLightUniformsLib.init();
  }, []);

  const selectFinish = (finishId) => {
    const finish = paintFinishes.find((item) => item.id === finishId) || paintFinishes[0];

    setPaintByModel((current) => ({
      ...current,
      [selectedModelId]: {
        ...(current[selectedModelId] || defaultPaint),
        ...finish,
        finishId: finish.id,
      },
    }));
  };

  const updatePaintValue = (key, value) => {
    setPaintByModel((current) => ({
      ...current,
      [selectedModelId]: {
        ...(current[selectedModelId] || defaultPaint),
        [key]: value,
      },
    }));
  };

  const updateCustomColor = (color) => {
    updatePaintValue("color", color);
  };

  const updateColorFromPalette = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const saturation = clamp((event.clientX - rect.left) / rect.width);
    const value = clamp(1 - (event.clientY - rect.top) / rect.height);

    updateCustomColor(
      rgbToHex(hsvToRgb({ h: selectedColorHsv.h, s: saturation, v: value })),
    );
  };

  const updateColorFromHue = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const hue = clamp((event.clientX - rect.left) / rect.width) * 360;

    updateCustomColor(
      rgbToHex(hsvToRgb({ h: hue, s: selectedColorHsv.s, v: selectedColorHsv.v })),
    );
  };

  const selectModel = (modelId) => {
    setSelectedModelId(modelId);
    setIsModelMenuOpen(false);
  };

  return (
    <main className="showroom">
      <nav className="model-dropdown" aria-label="Choose car model">
        <button
          type="button"
          className="model-trigger"
          onClick={() => setIsModelMenuOpen((isOpen) => !isOpen)}
          aria-expanded={isModelMenuOpen}
        >
          <span>
            <small>Model</small>
            {selectedModel.name}
          </span>
          <b>⌄</b>
        </button>

        <div className={`model-menu ${isModelMenuOpen ? "open" : ""}`}>
          {carModels.map((model) => (
            <button
              key={model.id}
              type="button"
              onClick={() => selectModel(model.id)}
              className={model.id === selectedModelId ? "active" : ""}
            >
              <span>{model.name}</span>
              <small>{model.desc}</small>
            </button>
          ))}
        </div>
      </nav>

      {isModelMenuOpen && (
        <button
          type="button"
          className="menu-scrim"
          aria-label="Close selector"
          onClick={() => {
            setIsModelMenuOpen(false);
          }}
        />
      )}

      <nav className="lighting-dropdown" aria-label="Choose lighting preset">
        <label className="lighting-label" htmlFor="lightingPreset">
          Lighting
        </label>
        <select
          id="lightingPreset"
          className="lighting-select"
          value={lightPreset}
          onChange={(event) => setLightPreset(event.target.value)}
        >
          <option value="daylight">Natural Daylight</option>
          <option value="overcast">Overcast Soft</option>
          <option value="golden-hour">Golden Hour</option>
          <option value="showroom">Showroom</option>
          <option value="studio">Studio Softbox</option>
        </select>
      </nav>

      <section className="hero-copy">
        <p className="eyebrow">Premium Wrap Studio</p>
        <h1>{selectedModel.name}</h1>
        <p>{selectedModel.desc}</p>
      </section>

      <section className="viewer-card" aria-label="3D car showroom">
        <Canvas
          camera={{ position: [0, 1.35, 6.4], fov: 35 }}
          dpr={[1, 2]}
          shadows
          gl={{
            antialias: true,
            alpha: true,
            outputColorSpace: THREE.SRGBColorSpace,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure:
              lightPreset === "daylight"
                ? 1.08
                : lightPreset === "golden-hour"
                  ? 1.04
                  : lightPreset === "overcast"
                    ? 0.98
                    : lightPreset === "studio"
                      ? 0.92
                      : 1.0,
          }}
        >
          <color
            attach="background"
            args={[
              lightPreset === "golden-hour"
                ? "#f6efe5"
                : lightPreset === "overcast"
                  ? "#e8edf2"
                  : lightPreset === "daylight"
                    ? "#eef2f7"
                    : "#f5f3f5",
            ]}
          />

          {lightPreset === "showroom" ? (
            <>
              <ambientLight intensity={0.65} />
              <hemisphereLight args={["#ffffff", "#d9d4ce", 1.1]} />
              <directionalLight
                castShadow
                intensity={2.2}
                position={[3, 4, 5]}
                shadow-mapSize={[1024, 1024]}
              />
              <directionalLight intensity={1.1} position={[-4, 2, -3]} />
            </>
          ) : lightPreset === "studio" ? (
            <>
              {/* Studio preset: softbox-style area lights + reduced fill to keep crisp clearcoat highlights. */}
              <ambientLight intensity={0.25} />
              <hemisphereLight args={["#ffffff", "#e7e2db", 0.55]} />

              <rectAreaLight
                intensity={18}
                width={6}
                height={2.4}
                position={[2.8, 2.1, 3.4]}
                rotation={[-0.45, 0.75, 0]}
                color={"#ffffff"}
              />
              <rectAreaLight
                intensity={8}
                width={5.5}
                height={2}
                position={[-3.6, 1.5, 1.2]}
                rotation={[-0.15, -0.95, 0]}
                color={"#ffffff"}
              />
              <rectAreaLight
                intensity={10}
                width={7}
                height={1.6}
                position={[0.0, 2.6, -3.8]}
                rotation={[-0.3, Math.PI, 0]}
                color={"#f7fbff"}
              />
              <directionalLight intensity={0.6} position={[4, 5, 2]} />
            </>
          ) : lightPreset === "daylight" ? (
            <>
              {/* Natural daylight: stronger sun key + cooler sky fill, closer to Porsche outdoor configurator look. */}
              <ambientLight intensity={0.22} />
              <hemisphereLight args={["#eaf3ff", "#e6d7c7", 0.95]} />
              <directionalLight
                castShadow
                intensity={3.1}
                position={[6.5, 9.5, 4.5]}
                shadow-mapSize={[2048, 2048]}
                shadow-bias={-0.00008}
              />
              <directionalLight intensity={0.75} position={[-4.5, 2.2, -3.4]} />
            </>
          ) : lightPreset === "golden-hour" ? (
            <>
              {/* Golden hour: warmer key/fill for sunset-like premium promo shots. */}
              <ambientLight intensity={0.2} />
              <hemisphereLight args={["#ffe3be", "#d7c4ab", 0.86]} />
              <directionalLight
                castShadow
                intensity={2.5}
                position={[5.2, 5.4, 6.8]}
                shadow-mapSize={[2048, 2048]}
                shadow-bias={-0.00008}
              />
              <directionalLight intensity={0.68} position={[-3.8, 2.1, -2.6]} color={"#ffe8c7"} />
            </>
          ) : (
            <>
              {/* Overcast: diffused highlights and softer contrast for paint inspection. */}
              <ambientLight intensity={0.35} />
              <hemisphereLight args={["#f3f7fc", "#d8dce1", 1.2]} />
              <directionalLight
                castShadow
                intensity={1.3}
                position={[1.2, 7.8, 2.4]}
                shadow-mapSize={[1024, 1024]}
                shadow-bias={-0.00006}
              />
              <directionalLight intensity={0.42} position={[-3.4, 2.1, -2.4]} color={"#f8fbff"} />
            </>
          )}

          <Suspense fallback={null}>
            <Environment
              preset={
                lightPreset === "daylight"
                  ? "city"
                  : lightPreset === "golden-hour"
                    ? "sunset"
                    : lightPreset === "overcast"
                      ? "dawn"
                      : "studio"
              }
              background={false}
              backgroundBlurriness={0}
              environmentIntensity={
                lightPreset === "studio"
                  ? 0.88
                  : lightPreset === "golden-hour"
                    ? 1.18
                    : lightPreset === "showroom"
                      ? 1.02
                      : lightPreset === "overcast"
                        ? 0.92
                        : lightPreset === "daylight"
                          ? 1.15
                          : 1.1
              }
            >
              {lightPreset === "daylight" && (
                <>
                  <Lightformer
                    form="rect"
                    intensity={2.2}
                    position={[0, 6, -8]}
                    rotation={[0, 0, 0]}
                    scale={[18, 8, 1]}
                    color="#eaf3ff"
                  />
                  <Lightformer
                    form="rect"
                    intensity={1.6}
                    position={[6, 3.5, 2]}
                    rotation={[0, -0.7, 0]}
                    scale={[6, 3, 1]}
                    color="#ffffff"
                  />
                  <Lightformer
                    form="circle"
                    intensity={0.9}
                    position={[-6, 4.5, 3]}
                    rotation={[0, 0.9, 0]}
                    scale={[2.2, 2.2, 1]}
                    color="#fff2d8"
                  />
                </>
              )}
              {lightPreset === "golden-hour" && (
                <>
                  <Lightformer
                    form="rect"
                    intensity={1.9}
                    position={[0, 5.5, -7]}
                    rotation={[0, 0, 0]}
                    scale={[16, 7, 1]}
                    color="#ffe4bd"
                  />
                  <Lightformer
                    form="circle"
                    intensity={1.2}
                    position={[-5.8, 3.8, 3.2]}
                    rotation={[0, 1.0, 0]}
                    scale={[2.6, 2.6, 1]}
                    color="#ffd9a8"
                  />
                </>
              )}
              {lightPreset === "overcast" && (
                <Lightformer
                  form="rect"
                  intensity={1.5}
                  position={[0, 6.5, -8]}
                  rotation={[0, 0, 0]}
                  scale={[20, 9, 1]}
                  color="#edf3fb"
                />
              )}
            </Environment>
          </Suspense>
          <Suspense fallback={<LoadingFallback />}>
            {modelStatus === undefined ? (
              <LoadingFallback />
            ) : hasModelFile ? (
              <CarModel
                modelPath={selectedModel.path}
                wrap={selectedPaint}
                modelId={selectedModel.id}
              />
            ) : (
              <PlaceholderCar wrap={selectedPaint} />
            )}
            <ContactShadows
              opacity={0.28}
              scale={8}
              blur={2.4}
              far={3.5}
              position={[0, -1.16, 0]}
            />
          </Suspense>
          <OrbitControls
            makeDefault
            enableRotate
            enablePan={false}
            enableZoom
            target={[0, 0.25, 0]}
            enableDamping
            dampingFactor={0.08}
            mouseButtons={{
              LEFT: THREE.MOUSE.ROTATE,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.ROTATE,
            }}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_ROTATE,
            }}
            rotateSpeed={0.85}
            minDistance={3.4}
            maxDistance={8.2}
            zoomSpeed={0.75}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
          />
        </Canvas>
      </section>

      <section
        className={`paint-simulator ${isPaintPanelOpen ? "open" : ""}`}
        aria-label="Paint color simulator"
      >
        <button
          type="button"
          className="paint-toggle"
          aria-expanded={isPaintPanelOpen}
          onClick={() => setIsPaintPanelOpen((isOpen) => !isOpen)}
        >
          <span style={{ background: selectedPaint.color }} />
          <b>{activeFinish.label}</b>
          <small>{isPaintPanelOpen ? "Close" : "Paint"}</small>
        </button>

        <div className="paint-panel">
          <div className="paint-panel-header">
            <span>Paint Simulator</span>
            <strong>{activeFinish.label}</strong>
          </div>

          <div className="paint-finish-tabs" aria-label="Choose paint finish">
            {paintFinishes.map((finish) => (
              <button
                key={finish.id}
                type="button"
                onClick={() => selectFinish(finish.id)}
                className={finish.id === selectedPaint.finishId ? "active" : ""}
              >
                {finish.label}
              </button>
            ))}
          </div>

          <div className="paint-color-picker">
            <div className="paint-color-head">
              <span>Body Color</span>
              <b>{selectedPaint.color.toUpperCase()}</b>
            </div>
            <div
              className="color-field"
              role="slider"
              aria-label="Body color saturation and brightness"
              aria-valuetext={selectedPaint.color}
              tabIndex={0}
              style={{ "--hue-color": hueColor }}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                updateColorFromPalette(event);
              }}
              onPointerMove={(event) => {
                if (event.buttons === 1) updateColorFromPalette(event);
              }}
            >
              <span
                style={{
                  left: `${selectedColorHsv.s * 100}%`,
                  top: `${(1 - selectedColorHsv.v) * 100}%`,
                }}
              />
            </div>
            <div
              className="hue-strip"
              role="slider"
              aria-label="Body color hue"
              aria-valuemin={0}
              aria-valuemax={360}
              aria-valuenow={Math.round(selectedColorHsv.h)}
              tabIndex={0}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                updateColorFromHue(event);
              }}
              onPointerMove={(event) => {
                if (event.buttons === 1) updateColorFromHue(event);
              }}
            >
              <span style={{ left: `${(selectedColorHsv.h / 360) * 100}%` }} />
            </div>
          </div>

          <div className="paint-sliders">
            {[
              ["metalness", "Metal", 0, 1, 0.01],
              ["roughness", "Blur", 0.01, 0.9, 0.01],
              ["clearcoat", "Clearcoat", 0, 1, 0.01],
              ["clearcoatRoughness", "Coat Blur", 0.006, 0.55, 0.001],
              ["envMapIntensity", "Reflection", 0.2, 3, 0.01],
            ].map(([key, label, min, max, step]) => (
              <label key={key}>
                <span>{label}</span>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={selectedPaint[key]}
                  onChange={(event) => updatePaintValue(key, Number(event.target.value))}
                />
                <b>{Number(selectedPaint[key]).toFixed(key === "clearcoatRoughness" ? 3 : 2)}</b>
              </label>
            ))}
          </div>
        </div>

      </section>
    </main>
  );
}

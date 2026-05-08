import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { carModels, wrapColors } from "../assets/data";
import LoadingFallback from "./LoadingFallback";
import CarModel, { PlaceholderCar } from "./CarModel";

export default function CarViewer() {
  const [selectedModelId, setSelectedModelId] = useState(carModels[0].id);
  const [wrapByModel, setWrapByModel] = useState(() =>
    Object.fromEntries(carModels.map((model) => [model.id, wrapColors[0].id])),
  );
  const [availableModels, setAvailableModels] = useState({});
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [lightPreset, setLightPreset] = useState("showroom");

  const selectedModel = useMemo(
    () => carModels.find((model) => model.id === selectedModelId) || carModels[0],
    [selectedModelId],
  );
  const selectedWrap = useMemo(() => {
    const wrapId = wrapByModel[selectedModelId] || wrapColors[0].id;
    return wrapColors.find((wrap) => wrap.id === wrapId) || wrapColors[0];
  }, [selectedModelId, wrapByModel]);
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

  const selectWrap = (wrapId) => {
    setWrapByModel((current) => ({
      ...current,
      [selectedModelId]: wrapId,
    }));
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
          <option value="showroom">Showroom</option>
          <option value="studio">Studio Softbox</option>
          <option value="daylight">Natural Daylight</option>
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
            toneMappingExposure: lightPreset === "daylight" ? 1.08 : 1.0,
          }}
        >
          <color
            attach="background"
            args={[lightPreset === "daylight" ? "#eef2f7" : "#f5f3f5"]}
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
          ) : (
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
          )}

          <Suspense fallback={null}>
            {lightPreset === "daylight" ? (
              <Environment preset="city" environmentIntensity={1.1}>
                {/* Lightformers add "photographic" sky/sun reflection shapes (key for natural clearcoat highlights). */}
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
              </Environment>
            ) : (
              <Environment preset="studio" />
            )}
          </Suspense>
          <Suspense fallback={<LoadingFallback />}>
            {modelStatus === undefined ? (
              <LoadingFallback />
            ) : hasModelFile ? (
              <CarModel
                modelPath={selectedModel.path}
                wrap={selectedWrap}
                modelId={selectedModel.id}
              />
            ) : (
              <PlaceholderCar wrap={selectedWrap} />
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

      <section className="wrap-strip" aria-label="Choose wrap color">
        {wrapColors.map((wrap) => (
          <button
            key={wrap.id}
            type="button"
            aria-label={wrap.label}
            title={wrap.label}
            onClick={() => selectWrap(wrap.id)}
            className={wrap.id === selectedWrap.id ? "active" : ""}
          >
            <span
              style={{
                background: wrap.color,
              }}
            />
            <small>{wrap.label}</small>
          </button>
        ))}
      </section>
    </main>
  );
}

import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { carModels, wrapColors } from "../assets/data";
import LoadingFallback from "./LoadingFallback";
import CarModel, { PlaceholderCar } from "./models/CarModel";

export default function CarViewer() {
  const [selectedModelId, setSelectedModelId] = useState(carModels[0].id);
  const [wrapByModel, setWrapByModel] = useState(() =>
    Object.fromEntries(carModels.map((model) => [model.id, wrapColors[0].id])),
  );
  const [availableModels, setAvailableModels] = useState({});
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

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
          gl={{ antialias: true, alpha: true }}
        >
          <color attach="background" args={["#f5f3f5"]} />
          <ambientLight intensity={0.65} />
          <hemisphereLight args={["#ffffff", "#d9d4ce", 1.1]} />
          <directionalLight
            castShadow
            intensity={2.2}
            position={[3, 4, 5]}
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight intensity={1.1} position={[-4, 2, -3]} />
          <Suspense fallback={null}>
            <Environment preset="studio" />
          </Suspense>
          <Suspense fallback={<LoadingFallback />}>
            {modelStatus === undefined ? (
              <LoadingFallback />
            ) : hasModelFile ? (
              <CarModel modelPath={selectedModel.path} wrap={selectedWrap} />
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

      <section className="detail-cards" aria-label="Showroom details">
        <article>
          <span>Selected Wrap</span>
          <strong>{selectedWrap.label}</strong>
        </article>
        <article>
          <span>Model Source</span>
          <strong>{hasModelFile ? "GLB Loaded" : "Preview Mode"}</strong>
        </article>
        <article>
          <span>Payment Method</span>
          <strong>Display Only</strong>
        </article>
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

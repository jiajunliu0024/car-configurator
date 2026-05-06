import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import { carModels, wrapColors } from "../assets/data";
import LoadingFallback from "./LoadingFallback";
import CarModel, { PlaceholderCar } from "./models/CarModel";

export default function CarViewer() {
  const [selectedModelId, setSelectedModelId] = useState(carModels[0].id);
  const [wrapByModel, setWrapByModel] = useState(() =>
    Object.fromEntries(carModels.map((model) => [model.id, wrapColors[0].id])),
  );
  const [availableModels, setAvailableModels] = useState({});

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

  return (
    <main className="showroom">
      <nav className="model-tabs" aria-label="Choose car model">
        {carModels.map((model) => (
          <button
            key={model.id}
            type="button"
            onClick={() => setSelectedModelId(model.id)}
            className={model.id === selectedModelId ? "active" : ""}
          >
            {model.name}
          </button>
        ))}
      </nav>

      <aside className="color-sidebar" aria-label="Choose wrap color">
        <div className="sidebar-icon">Q</div>
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
          </button>
        ))}
      </aside>

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
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 2.45}
            maxPolarAngle={Math.PI / 2.05}
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
    </main>
  );
}

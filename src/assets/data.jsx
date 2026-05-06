import teslaModel3Url from "../components/models/tesla_2018_model_3.glb?url";

const carModels = [
  {
    id: "tesla-model-3",
    name: "Tesla Model 3",
    desc: "Electric Performance Sedan",
    path: teslaModel3Url,
  },
  {
    id: "byd-seal",
    name: "BYD Seal",
    desc: "Performance Electric Sedan",
    path: "/models/byd-seal.glb",
  },
  {
    id: "volvo-ex30",
    name: "Volvo EX30",
    desc: "Fully Electric Crossover",
    path: "/models/volvo-ex30.glb",
  },
];

const wrapColors = [
  {
    id: "emerald",
    label: "Emerald",
    color: "#00b98f",
    metalness: 0.45,
    roughness: 0.28,
  },
  {
    id: "pearl",
    label: "Pearl",
    color: "#f4f1ea",
    metalness: 0.25,
    roughness: 0.2,
  },
  {
    id: "silver",
    label: "Silver",
    color: "#c0c4c8",
    metalness: 0.85,
    roughness: 0.18,
  },
  {
    id: "graphite",
    label: "Graphite",
    color: "#23262b",
    metalness: 0.55,
    roughness: 0.24,
  },
  {
    id: "midnight",
    label: "Midnight",
    color: "#07122a",
    metalness: 0.5,
    roughness: 0.22,
  },
  {
    id: "crimson",
    label: "Crimson",
    color: "#8f101f",
    metalness: 0.5,
    roughness: 0.25,
  },
  {
    id: "gold",
    label: "Gold",
    color: "#d6a73a",
    metalness: 0.75,
    roughness: 0.2,
  },
  {
    id: "gradient",
    label: "Gradient",
    color: "linear-gradient(135deg, #7c3aed, #06b6d4)",
    gradient: true,
  },
];

export { carModels, wrapColors };

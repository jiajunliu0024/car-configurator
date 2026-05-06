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
  {
    id: "porsche-911",
    name: "Porsche 911",
    desc: "Sports Coupe Preview",
    path: "/models/porsche-911.glb",
  },
  {
    id: "range-rover",
    name: "Range Rover",
    desc: "Luxury SUV Preview",
    path: "/models/range-rover.glb",
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
    label: "Gradient Shift",
    color: "linear-gradient(135deg, #7c3aed, #06b6d4)",
    gradient: true,
    colors: ["#7c3aed", "#06b6d4"],
  },
  {
    id: "sunset-gradient",
    label: "Sunset Gradient",
    color: "linear-gradient(135deg, #f97316, #ec4899, #7c3aed)",
    gradient: true,
    colors: ["#f97316", "#ec4899"],
  },
  {
    id: "laser",
    label: "Laser Chrome",
    color:
      "linear-gradient(135deg, #ff2bd6 0%, #7c3aed 24%, #00e5ff 48%, #b6ff00 72%, #fff 100%)",
    laser: true,
  },
  {
    id: "aqua-laser",
    label: "Aqua Laser",
    color:
      "linear-gradient(135deg, #00f5d4 0%, #00bbf9 32%, #9b5de5 64%, #fee440 100%)",
    laser: true,
  },
];

export { carModels, wrapColors };

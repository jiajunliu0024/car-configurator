import teslaModel3Url from "../components/models/tesla_2018_model_3.glb?url";
import bmwM4Url from "../components/models/2025_bmw_m4_competition.glb?url";
import audiRs5Url from "../components/models/audi_rs5.glb?url";
import bydSealUrl from "../components/models/2024_byd_seal.glb?url";

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
    path: bydSealUrl,
  },
  {
    id: "bmw-m4-competition",
    name: "BMW M4 Competition",
    desc: "High-Performance Sports Coupe",
    path: bmwM4Url,
  },
  {
    id: "audi-rs5",
    name: "Audi RS5",
    desc: "Grand Touring Performance Coupe",
    path: audiRs5Url,
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
    id: "arctic-blue",
    label: "Arctic Blue",
    color: "#7fa6cc",
    metalness: 0.58,
    roughness: 0.23,
  },
  {
    id: "teal-steel",
    label: "Teal Steel",
    color: "#2f7f86",
    metalness: 0.6,
    roughness: 0.24,
  },
  {
    id: "deep-purple",
    label: "Deep Purple",
    color: "#4b2c6c",
    metalness: 0.56,
    roughness: 0.26,
  },
  {
    id: "rose-bronze",
    label: "Rose Bronze",
    color: "#aa6f62",
    metalness: 0.62,
    roughness: 0.24,
  },
  {
    id: "ice-mint",
    label: "Ice Mint",
    color: "#b8f2e2",
    metalness: 0.32,
    roughness: 0.21,
  },
  {
    id: "nardo-gray",
    label: "Nardo Gray",
    color: "#8b8f97",
    metalness: 0.52,
    roughness: 0.27,
  },
  {
    id: "satin-black",
    label: "Satin Black",
    color: "#15171a",
    metalness: 0.4,
    roughness: 0.35,
  },
  {
    id: "obsidian",
    label: "Obsidian",
    color: "#101420",
    metalness: 0.62,
    roughness: 0.2,
  },
  {
    id: "champagne",
    label: "Champagne",
    color: "#d8c6a5",
    metalness: 0.5,
    roughness: 0.24,
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
];

export { carModels, wrapColors };

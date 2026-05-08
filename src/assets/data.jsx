import teslaModel3Url from "../components/models/tesla_2018_model_3.glb?url";
import bmwM4Url from "../components/models/2025_bmw_m4_competition.glb?url";
import audiRs5Url from "../components/models/audi_rs5.glb?url";
import bydSealUrl from "../components/models/2024_byd_seal.glb?url";
import porsche911Url from "../components/models/porsche_911.glb?url";

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
  {
    id: "porsche-911",
    name: "Porsche 911",
    desc: "Iconic Sports Car",
    path: porsche911Url,
  },
];

// to-do: update the wrap colors
const wrapColors = [
  {
    id: "oak-green-metallic-neo",
    label: "Oak Green Metallic Neo (M6E)",
    // Porsche-inspired tone from public color references: deeper/saturated oak green, glossy metallic.
    color: "#1f372c",
    metalness: 0.82,
    roughness: 0.14,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
  },
  {
    id: "vanadium-grey-metallic",
    label: "Vanadium Grey Metallic",
    // Tuned to match the reference: cool deep gray + crisp clearcoat highlight.
    color: "#4a515a",
    metalness: 0.76,
    roughness: 0.22,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
  },
  {
    id: "mirror-gloss-obsidian",
    label: "Mirror Gloss Obsidian",
    // Mirror-like deep gloss: very low roughness + sharp clearcoat layer.
    color: "#0c1018",
    metalness: 0.88,
    roughness: 0.04,
    clearcoat: 1.0,
    clearcoatRoughness: 0.015,
  },
  {
    id: "mirror-pearl-gray",
    label: "Mirror Pearl Gray",
    // Bright mirror gray with subtle pearl-like sheen under daylight.
    color: "#aab0bb",
    metalness: 0.9,
    roughness: 0.055,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
  },
  {
    id: "mirror-pearl-storm-gray",
    label: "Mirror Pearl Storm Gray",
    // Slightly deeper gray pearl mirror finish, closer to premium OEM metallic tone.
    color: "#8e96a3",
    metalness: 0.86,
    roughness: 0.065,
    clearcoat: 1.0,
    clearcoatRoughness: 0.022,
  },
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

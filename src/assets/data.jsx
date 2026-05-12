import teslaModel3Url from "../components/models/tesla_2018_model_3.glb?url";
import bmwM4Url from "../components/models/2025_bmw_m4_competition.glb?url";
import audiRs5Url from "../components/models/audi_rs5.glb?url";
import bydSealUrl from "../components/models/2024_byd_seal.glb?url";
import porsche911Url from "../components/models/porsche_911.glb?url";

const carModels = [
  {
    id: "porsche-911",
    name: "Porsche 911",
    desc: "Iconic Sports Car",
    path: porsche911Url,
  },
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

const paintFinishes = [
  {
    id: "mirror",
    label: "Mirror Gloss",
    metalness: 0.86,
    roughness: 0.035,
    clearcoat: 1.0,
    clearcoatRoughness: 0.01,
    envMapIntensity: 2.15,
  },
  {
    id: "metallic",
    label: "Gloss Metallic",
    metalness: 0.78,
    roughness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.035,
    envMapIntensity: 1.65,
  },
  {
    id: "satin",
    label: "Satin",
    metalness: 0.42,
    roughness: 0.36,
    clearcoat: 0.7,
    clearcoatRoughness: 0.18,
    envMapIntensity: 1.05,
  },
  {
    id: "matte",
    label: "Matte",
    metalness: 0.12,
    roughness: 0.82,
    clearcoat: 0.18,
    clearcoatRoughness: 0.52,
    envMapIntensity: 0.45,
  },
  {
    id: "chrome",
    label: "Chrome",
    metalness: 1.0,
    roughness: 0.018,
    clearcoat: 1.0,
    clearcoatRoughness: 0.006,
    envMapIntensity: 2.6,
  },
];

export { carModels, paintFinishes };

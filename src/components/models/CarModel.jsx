import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

const BODY_NAME_MATCH = [
  "primary",
  "body",
  "paint",
  "carpaint",
  "bodywork",
  "shell",
  "bumper",
  "door",
  "hood",
  "bonnet",
  "trunk",
  "boot",
  "fender",
  "quarter",
  "panel",
  "roof",
  "mirror",
  "spoiler",
];

const PAINT_MATERIAL_MATCH = ["primary", "carpaint", "paint", "body"];

const NON_WRAP_MATCH = [
  "wheel",
  "tire",
  "tyre",
  "rim",
  "brake",
  "disc",
  "caliper",
  "glass",
  "window",
  "windshield",
  "windscreen",
  "light",
  "lamp",
  "headlight",
  "taillight",
  "indicator",
  "interior",
  "seat",
  "steering",
  "dashboard",
  "grill",
  "grille",
  "chrome",
  "emblem",
  "badge",
  "license",
  "plate",
];

function hasNameToken(text, term) {
  const tokens = text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

  return tokens.some(
    (token) =>
      token === term ||
      token === `${term}s` ||
      (term.length > 4 && token.startsWith(term)),
  );
}

function createWrapMaterial(wrap) {
  if (wrap?.gradient) {
    return new THREE.ShaderMaterial({
      uniforms: {
        colorA: { value: new THREE.Color("#7c3aed") },
        colorB: { value: new THREE.Color("#06b6d4") },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 colorA;
        uniform vec3 colorB;
        varying vec3 vNormal;
        void main() {
          float mixValue = smoothstep(-0.45, 0.85, vNormal.y + vNormal.x * 0.6);
          vec3 color = mix(colorA, colorB, mixValue);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
  }

  return new THREE.MeshPhysicalMaterial({
    color: wrap?.color || "#00b98f",
    metalness: wrap?.metalness ?? 0.45,
    roughness: wrap?.roughness ?? 0.24,
    clearcoat: 0.75,
    clearcoatRoughness: 0.16,
  });
}

function findBodyMeshes(meshes) {
  const getMeshSearchText = (mesh) => {
    const materialNames = Array.isArray(mesh.material)
      ? mesh.material.map((material) => material?.name || "")
      : [mesh.material?.name || ""];

    return [mesh.name, ...materialNames].join(" ").toLowerCase();
  };

  const getMaterialNames = (mesh) =>
    Array.isArray(mesh.material)
      ? mesh.material.map((material) => material?.name || "")
      : [mesh.material?.name || ""];

  const isNonWrapMesh = (mesh) => {
    const searchable = getMeshSearchText(mesh);

    return NON_WRAP_MATCH.some((term) => hasNameToken(searchable, term));
  };

  const wrapCandidates = meshes.filter((mesh) => !isNonWrapMesh(mesh));

  const paintMaterialMeshes = wrapCandidates.filter((mesh) =>
    getMaterialNames(mesh).some((name) => {
      const materialName = name.toLowerCase();
      return PAINT_MATERIAL_MATCH.some(
        (term) => materialName === term || materialName.startsWith(`${term}.`),
      );
    }),
  );

  if (paintMaterialMeshes.length > 0) return paintMaterialMeshes;

  const namedBodies = wrapCandidates.filter((mesh) =>
    BODY_NAME_MATCH.some((term) => hasNameToken(getMeshSearchText(mesh), term)),
  );

  if (namedBodies.length > 0) return namedBodies;

  if (wrapCandidates.length > 0) return wrapCandidates;

  const largestMesh = meshes.reduce((largest, mesh) => {
    mesh.geometry.computeBoundingBox();
    const size = new THREE.Vector3();
    mesh.geometry.boundingBox?.getSize(size);
    const volume = size.x * size.y * size.z;
    return volume > largest.volume ? { mesh, volume } : largest;
  }, { mesh: null, volume: 0 }).mesh;

  return largestMesh ? [largestMesh] : meshes;
}

function prepareScene(scene, wrapMaterial) {
  const clone = scene.clone(true);
  const meshes = [];

  clone.traverse((child) => {
    if (!child.isMesh) return;
    child.castShadow = true;
    child.receiveShadow = true;
    meshes.push(child);
  });

  const bodyMeshes = findBodyMeshes(meshes);
  const targets = bodyMeshes.length > 0 ? bodyMeshes : meshes;

  targets.forEach((mesh) => {
    mesh.material = wrapMaterial;
  });

  const box = new THREE.Box3().setFromObject(clone);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxDimension = Math.max(size.x, size.y, size.z) || 1;
  const scale = 4.2 / maxDimension;
  const position = [-center.x * scale, -box.min.y * scale - 0.5, -center.z * scale];

  return { clone, position, scale };
}

export default function CarModel({ modelPath, wrap }) {
  const { scene } = useGLTF(modelPath);
  const wrapMaterial = useMemo(() => createWrapMaterial(wrap), [wrap]);
  const prepared = useMemo(
    () => prepareScene(scene, wrapMaterial),
    [scene, wrapMaterial],
  );

  return (
    <primitive
      object={prepared.clone}
      position={prepared.position}
      scale={prepared.scale}
    />
  );
}

export function PlaceholderCar({ wrap }) {
  const wrapMaterial = useMemo(() => createWrapMaterial(wrap), [wrap]);
  const blackMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#111111", roughness: 0.35 }),
    [],
  );
  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#dff6ff",
        roughness: 0.04,
        transmission: 0.25,
        transparent: true,
        opacity: 0.72,
      }),
    [],
  );

  return (
    <group position={[0, -0.65, 0]} rotation={[0, -0.18, 0]}>
      <mesh castShadow receiveShadow material={wrapMaterial} position={[0, 0.45, 0]}>
        <boxGeometry args={[4.4, 0.78, 1.55]} />
      </mesh>
      <mesh castShadow material={wrapMaterial} position={[0.35, 1.05, 0]}>
        <boxGeometry args={[2.25, 0.72, 1.34]} />
      </mesh>
      <mesh castShadow material={glassMaterial} position={[0.34, 1.2, 0.01]}>
        <boxGeometry args={[1.55, 0.42, 1.38]} />
      </mesh>
      {[-1.45, 1.45].map((x) =>
        [-0.84, 0.84].map((z) => (
          <mesh
            key={`${x}-${z}`}
            castShadow
            material={blackMaterial}
            position={[x, 0.1, z]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.38, 0.38, 0.28, 48]} />
          </mesh>
        )),
      )}
    </group>
  );
}

import { Html } from "@react-three/drei";

export default function LoadingFallback() {
  return (
    <Html center>
      <div className="model-loading">
        <span />
        Loading model
      </div>
    </Html>
  );
}

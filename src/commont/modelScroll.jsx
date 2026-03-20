import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Model from "./model";

export default function ScrollScene({ progress }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{
          position: "sticky",
          top: 0,
          width: "100vw",
          height: "100vh",
        }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} />
        <Suspense fallback={null}>
          <Model progress={progress} />
        </Suspense>
      </Canvas>
    </div>
  );
}

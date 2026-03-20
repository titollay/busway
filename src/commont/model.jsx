import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function Model({ progress }) {
  const { scene } = useGLTF("/model/base_basic_shaded.glb");
  const ref = useRef();

  const startX = 2.5;
  const endX = 0;
  const startY = 0;
  const endY = -2;

  useFrame(() => {
    if (!ref.current || !progress) return;

    const v = progress.get();

    ref.current.rotation.y += 0.01;
    ref.current.rotation.x = v * Math.PI * 2;

    ref.current.position.x = startX + v * (endX - startX);
    ref.current.position.y = startY + v * (endY - startY);
    ref.current.position.z = -v * 2;
  });

  return <primitive ref={ref} object={scene} scale={1} />;
}

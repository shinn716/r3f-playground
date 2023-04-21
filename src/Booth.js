import { Float } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export function Booth({ targetUrl, position, scale = 1, finisAction = null }) {
  const gltf = useLoader(GLTFLoader, targetUrl, null, (e) => {
    let percentComplete = (e.loaded / e.total) * 100;
    if (percentComplete === Infinity || percentComplete === 100) {
      return;
    } else {
      console.log(Math.round(percentComplete) + " % ");
    }
  });

  useEffect(() => {
    if (!gltf) return;
    if (finisAction != null) finisAction();
  }, [gltf]);

  return <primitive position={position} object={gltf.scene} scale={scale} />;
}

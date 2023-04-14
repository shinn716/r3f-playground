import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export function Booth() {
  const gltf = useLoader(
    GLTFLoader,
    "studio_apartment_vray_baked_textures_included/scene.gltf",
    // "https://sgmsavirtualbooth.blob.core.windows.net/test/threejs_test_models/gltf/Scenario_M1_nolight.glb",
    null,
    (e) => {
      // console.log(e.total);
      let percentComplete = (e.loaded / e.total) * 100;
      if (percentComplete === Infinity || percentComplete === 100) {
        console.log("Loadfinish!!!");
        return;
      } else {
        console.log(Math.round(percentComplete) + " % ");
      }
    }
  );
  return (
    <primitive position={[-0.2, 0, -0.1]} object={gltf.scene} scale={0.3} />
  );
}

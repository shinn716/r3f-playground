import {
  Cloud,
  CubeCamera,
  Environment,
  Float,
  Html,
  MeshReflectorMaterial,
  OrbitControls,
  PerspectiveCamera,
  PointMaterial,
  Points,
  Sky,
  Stats,
  Text,
  useCursor,
  useProgress,
  useVideoTexture,
} from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import FirstPerson from "@/components/FirstPerson";
import MyFirstPersonControls from "../../components/FirstPerson/MyFirstPersonControls";
import DragController from "./DragController";
import { AxesHelper } from "three";
import { Booth } from "./Booth";

// const Model = () => {
//   const gltf = useLoader(
//     GLTFLoader,
//     "studio_apartment_vray_baked_textures_included/scene.gltf",
//     // "https://sgmsavirtualbooth.blob.core.windows.net/test/threejs_test_models/gltf/Scenario_M1_nolight.glb",
//     null,
//     (e) => {
//       // console.log(e.total);
//       let percentComplete = (e.loaded / e.total) * 100;
//       if (percentComplete === Infinity || percentComplete === 100) {
//         console.log("Loadfinish!!!");
//         return;
//       } else {
//         console.log(Math.round(percentComplete) + " % ");
//       }
//     }
//   );
//   return (
//     <primitive position={[-0.2, 0, -0.1]} object={gltf.scene} scale={0.3} />
//   );
// };

const Main = () => {
  const { scene } = useThree();
  const { camera } = useThree();

  const dragref = useRef();
  var objects = [];

  console.log(scene.children);

  useEffect(() => {
    for (let i = 0; i < scene.children.length; i++) {
      if (scene.children[i].name === "Sketchfab_Scene") {
        camera.position.set(
          scene.children[i].position.x,
          0.17 * 3,
          scene.children[i].position.z
        );
      } else if (scene.children[i].name === "cube") {
        objects.push(scene.children[i]);
      }
    }

    dragref.current.init(
      objects,
      () => (MyFirstPersonControls.enable = false),
      () => (MyFirstPersonControls.enable = true)
    );
  }, []);

  return (
    <>
      <FirstPerson />
      <DragController ref={dragref} />
      <Box
        color={Math.random() * 0xffffff}
        position={[0.41, 0.58, -0.15]}
        rotation={[0, -1.57, 0]}
      />
      <Box
        color={Math.random() * 0xffffff}
        position={[0.41, 0.61, -0.02]}
        rotation={[0, -1.57, 0]}
      />
    </>
  );
};

function Box({ position, rotation, color }) {
  const ref = useRef();
  return (
    <mesh name="cube" position={position} rotation={rotation} ref={ref}>
      <boxBufferGeometry args={[0.1, 0.1, 0.01]} attach="geometry" />
      <meshPhongMaterial color={color} attach="material" />
    </mesh>
  );
}

export default function test() {
  return (
    <div className="john">
      <Canvas>
        <FirstPerson />
        <Main />
        <Sky />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5.3, 1.0, 2.4]} castShadow />
        {/* <Model /> */}

        <Booth />

        {/* <OrbitControls */}
      </Canvas>
    </div>
  );
}

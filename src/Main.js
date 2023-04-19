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
  Text,
  useCursor,
  useProgress,
  useVideoTexture,
} from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState } from "react";
import FirstPerson from "./components/FirstPerson/FirstPerson";
import DragController from "./components/DragController/DragController";
import { Booth } from "./Booth";
import { Stats } from "@react-three/drei";
// import { Button, DatePicker } from "antd";

const Scene = () => {
  const { scene } = useThree();
  const { camera } = useThree();

  const dragref = useRef();
  const controlsref = useRef();
  var objects = [];

  camera.layers.enableAll();

  console.log(scene.children);

  useEffect(() => {
    for (let i = 0; i < scene.children.length; i++) {
      // if (scene.children[i].name === "Sketchfab_Scene") {
      //   camera.position.set(
      //     scene.children[i].position.x,
      //     0.17 * 3,
      //     scene.children[i].position.z
      //   );
      // }
      if (scene.children[i].name === "cube") {
        objects.push(scene.children[i]);
      }
    }

    dragref.current.init(
      objects,
      () => {
        controlsref.current.enable(false);
      },
      () => {
        controlsref.current.enable(true);
      }
    );

    // set camera transfrom
    controlsref.current.setHeight(1.7);
    controlsref.current.setPosition(-0.24, 1.7, 0.1);
    controlsref.current.setRotation(0, -90, 0);
  }, []);

  return (
    <>
      <FirstPerson ref={controlsref} />
      <DragController ref={dragref} />
      <Box
        color={Math.random() * 0xffffff}
        position={[1.8, 1.8, -0.3]}
        rotation={[0, -1.57, 0]}
      />
      <Box
        color={Math.random() * 0xffffff}
        position={[1.8, 1.8, 0.1]}
        rotation={[0, -1.57, 0]}
      />
    </>
  );
};

function Box({ position, rotation, color }) {
  const ref = useRef();
  return (
    <group name="cube">
      <mesh name="cube" position={position} rotation={rotation} ref={ref}>
        <boxBufferGeometry args={[0.35, 0.35, 0.02]} attach="geometry" />
        <meshPhongMaterial color={color} attach="material" />
        <axesHelper args={[0.25, 0.25, 0.25]} layers={2} />
      </mesh>
    </group>
  );
}

// function GUI() {
//   return (
//     <>
//       <Button type="primary">PRESS ME</Button>
//       <DatePicker placeholder="select date" />
//     </>
//   );
// }

export function Main() {
  console.log("Main");

  return (
    <>
      <Scene />
      <Sky />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5.3, 1.0, 2.4]} castShadow />
      <Booth />
      <Stats />
      {/* <GUI /> */}
      {/* <OrbitControls */}
    </>
  );
}

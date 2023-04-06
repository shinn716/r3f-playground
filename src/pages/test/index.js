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
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import FirstPerson from "@/components/FirstPerson";
import { DragControls } from "three/addons/controls/DragControls.js";
import { Utils } from "./Utils";
import MyFirstPersonControls from "../../components/FirstPerson/MyFirstPersonControls";

const Model = () => {
  const gltf = useLoader(
    GLTFLoader,
    "studio_apartment_vray_baked_textures_included/scene.gltf"
  );
  return (
    <primitive position={[-0.2, 0, -0.1]} object={gltf.scene} scale={0.3} />
  );
};

function Main() {
  const { scene } = useThree();
  const { camera, gl } = useThree();

  // camera.layers.enableAll();

  useEffect(() => {
    for (let i = 0; i < scene.children.length; i++) {
      if (scene.children[i].name === "Sketchfab_Scene") {
        camera.position.set(
          scene.children[i].position.x,
          0.17 * 3,
          scene.children[i].position.z
        );
      }
    }

    var objects = [];
    let px, py, pz;

    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.name = "cube";
    cube.scale.set(1, 1, 0.1);
    scene.add(cube);
    objects.push(cube);

    const controls = new DragControls(objects, camera, gl.domElement);

    controls.addEventListener("dragstart", function (event) {
      MyFirstPersonControls.enable = false;
    });

    controls.addEventListener("dragend", function (event) {
      MyFirstPersonControls.enable = true;
    });

    controls.addEventListener("drag", function (event) {
      const raycaster = controls.getRaycaster();
      const hits = raycaster.intersectObjects(scene.children);

      if (
        hits[0].object.name != "floor" &&
        hits[0].object.name != "" &&
        hits[0].object.name != "cube"
      ) {
        event.object.position.set(
          hits[0].point.x,
          hits[0].point.y,
          hits[0].point.z
        );
        px = hits[0].point.x;
        py = hits[0].point.y;
        pz = hits[0].point.z;

        let dir = Utils.CalcuteNormalDirection(hits[0]);
        event.object.lookAt(dir.x, dir.y, dir.z);
      } else {
        event.object.position.set(px, py, pz);
      }
    });
  }, []);

  return (
    <>
      <FirstPerson enable={true} />
    </>
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
        <Model />

        {/* <OrbitControls */}
      </Canvas>
    </div>
  );
}

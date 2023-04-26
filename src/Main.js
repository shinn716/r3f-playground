import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import {
  Environment,
  Html,
  OrbitControls,
  Reflector,
  Stats,
  useCursor,
} from "@react-three/drei";
import {
  ChromaticAberration,
  EffectComposer,
} from "@react-three/postprocessing";
import { geometry, material } from "./store";
import TWEEN from "@tweenjs/tween.js";

function Sphere(props) {
  const meshRef = useRef();
  const [buttonText, setButtonText] = useState("");
  const [hovered, hover] = useState(null);
  useCursor(hovered);

  useEffect(() => {
    // console.log(meshRef);
    setButtonText(meshRef.current.uuid);
  }, [meshRef]);

  return (
    <>
      <mesh
        ref={meshRef}
        receiveShadow
        castShadow
        {...props}
        renderOrder={-2000000}
        geometry={geometry.sphere}
        material={material.sphere}
      >
        <Html distanceFactor={10}>
          <div
            className="content"
            style={{ fontSize: 40 }}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onClick={() => {
              console.log(meshRef.current.uuid);
            }}
          >
            {buttonText}
          </div>
        </Html>
      </mesh>
    </>
  );
}

function Spheres() {
  const group = useRef();
  useFrame(() => {
    group.current.children[0].position.x = THREE.MathUtils.lerp(
      group.current.children[0].position.x,
      -18,
      0.02
    );
    group.current.children[1].position.x = THREE.MathUtils.lerp(
      group.current.children[1].position.x,
      -10,
      0.01
    );
    group.current.children[2].position.x = THREE.MathUtils.lerp(
      group.current.children[2].position.x,
      19,
      0.03
    );
    group.current.children[3].position.x = THREE.MathUtils.lerp(
      group.current.children[3].position.x,
      10,
      0.04
    );
  });
  return (
    <group ref={group}>
      <Sphere position={[-40, 1, 10]} />
      <Sphere position={[-20, 10, -20]} scale={[10, 10, 10]} />
      <Sphere position={[40, 3, 5]} scale={[3, 3, 3]} />
      <Sphere position={[30, 0.75, 10]} scale={[0.75, 0.75, 0.75]} />
    </group>
  );
}

const Map = (x, in_min, in_max, out_min, out_max) => {
  return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

function Zoom() {
  const { camera, mouse } = useThree();
  const [mystate, setmyState] = useState(false);
  let value = 0;

  useFrame(() => {
    TWEEN.update();
    setmyState(true);

    // if (mouse.x > 0.45) value = 3;
    // else if (mouse.x < -0.45) value = -3;
    // else value = 0;
    // camera.position.x = THREE.MathUtils.lerp(camera.position.x, value, 0.02);

    // value = Map(mouse.x, -0.45, 0.45, -2, 2);
    // camera.position.x = THREE.MathUtils.lerp(camera.position.x, value, 0.02);
  });

  useEffect(() => {
    const vec = new THREE.Vector3(0, 0, 100);
    new TWEEN.Tween(camera.position)
      .to(vec, 2000)
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .start();

    new TWEEN.Tween(camera)
      .to({ fov: 20 }, 2000)
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .start()
      .onUpdate(() => {
        camera.updateProjectionMatrix();
      });

    camera.lookAt(0, 0, 0);
  }, [camera, mystate]);
}

export function Main() {
  return (
    <>
      <fog attach="fog" args={["#a0a0a0", 100, 150]} />
      <color attach="background" args={["#a0a0a0"]} />
      <spotLight
        penumbra={1}
        angle={0.35}
        castShadow
        position={[40, 80, 0]}
        intensity={1}
        shadow-mapSize={[256, 256]}
      />

      <group position={[0, -12, 0]}>
        <Spheres />
        <mesh
          rotation-x={-Math.PI / 2}
          position={[0, 0.01, 0]}
          scale={[300, 300, 300]}
          receiveShadow
          renderOrder={100000}
        >
          <planeBufferGeometry attach="geometry" />
          <shadowMaterial
            attach="material"
            transparent
            color="#251005"
            opacity={0.2}
          />
        </mesh>
        <Reflector
          resolution={1024}
          blur={[800, 50]}
          mirror={0.4}
          mixBlur={1}
          mixStrength={0.5}
          depthScale={1}
          minDepthThreshold={0.7}
          maxDepthThreshold={1}
          rotation-x={-Math.PI / 2}
          args={[100, 100]}
          color="#d0d0d0"
          metalness={1}
          roughness={0.75}
        />
      </group>
      <Environment preset="apartment" />
      <Zoom />
      <Stats />
      <OrbitControls maxPolarAngle={Math.PI / 2} />

      <EffectComposer>
        <ChromaticAberration
          radialModulation={true}
          offset={[0.00175, 0.00175]}
        />
      </EffectComposer>
    </>
  );
}

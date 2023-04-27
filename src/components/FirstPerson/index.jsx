import * as THREE from "three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import TWEEN from "@tweenjs/tween.js";
import useKeyboard from "./useKeyboard";

// import MyFirstPersonControls from "./MyFirstPersonControls";

const moveSpeed = 5;
const dragSpeed = 0.4;

var lastX, lastY;
var isClick = false;
var dragFlag = false;
var counting = 0;
var camrx = 0;
var camry = 0;
var height = 1.7;
var enable = true;
var enableKeyboard = true;

const FirstPerson = forwardRef((props, ref) => {
  const { camera } = useThree();
  const { scene } = useThree();
  const footprintRef = useRef(null);
  const keyMap = useKeyboard();

  const tex2Dfootprint = useLoader(
    THREE.TextureLoader,
    process.env.PUBLIC_URL + "/icons/footprint.png"
  );

  useImperativeHandle(ref, () => ({
    enable(_enable) {
      enable = _enable;
      // controller.Enable(value);
    },
    setPosition(px, py, pz) {
      // controller.SetCamPosition(px, py, pz);
      camera.position.set(px, py, pz);
    },
    setRotation(rx, ry, rz) {
      camera.rotation.set(
        (rx * Math.PI) / 180,
        (ry * Math.PI) / 180,
        (rz * Math.PI) / 180
      );
      // controller.SetCamRotation(rx, ry, rz);
    },
    setHeight(_height) {
      height = _height;
      // controller.SetHeight(height);
    },
    getHeight() {
      return height;
      // return controller.GetHeight();
    },
  }));

  // const controller = new MyFirstPersonControls(camera, scene, true);

  const raycaster_mover = new THREE.Raycaster();
  const raycaster_click = new THREE.Raycaster();
  const mouse_move = new THREE.Vector2();
  const pointer_click = new THREE.Vector2();

  document.onpointerdown = function (e) {
    if (enable) dragFlag = true;
    lastX = e.clientX;
    lastY = e.clientY;
  };

  document.onpointerup = function (e) {
    if (!enable) return;
    dragFlag = false;
    counting = 0;
    lastX = 0;
    lastY = 0;

    if (isClick) {
      isClick = false;
    } else {
      pointer_click.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer_click.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster_click.setFromCamera(pointer_click, camera);
      const intersects = raycaster_click.intersectObjects(scene.children);

      if (intersects.length > 0) {
        if (intersects[0].object.name === "") return;
        if (intersects[0].object.name === "floor") {
          new TWEEN.Tween(camera.position)
            .to(
              {
                x: intersects[0].point.x,
                y: height,
                z: intersects[0].point.z,
              },
              1000
            )
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .start();
        }
      }
    }
  };

  document.onpointermove = function (e) {
    if (!enable) return;
    if (isClick) {
      var deltaX = e.clientX - lastX;
      var deltaY = e.clientY - lastY;

      camry += ((-deltaX * Math.PI) / 180) * dragSpeed;
      camrx += ((-deltaY * Math.PI) / 180) * dragSpeed;

      const euler = new THREE.Euler(0, 0, 0, "YXZ");
      euler.x = camrx;
      euler.y = camry;
      camera.quaternion.setFromEuler(euler);
      footprintRef.current.visible = false;

      lastX = e.clientX;
      lastY = e.clientY;
    } else {
      mouse_move.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse_move.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster_mover.setFromCamera(mouse_move, camera);
      const hits = raycaster_mover.intersectObjects(scene.children);

      if (footprintRef.current === undefined) return;
      if (hits[0] === undefined) return;

      footprintRef.current.visible = true;
      footprintRef.current.position.set(hits[0].point.x, 0.05, hits[0].point.z);
      footprintRef.current.lookAt(
        camera.position.x,
        camera.position.y + 90,
        camera.position.z
      );
    }
  };

  useEffect(() => {
    // controller.CreateFootprint(scene);
    // controller.CreateWalkArea(0.1, 20);

    camera.near = 0.01;
    camera.updateProjectionMatrix();
  }, []);

  useFrame((_, delta) => {
    // controller?.Update();

    if (!enable) return;
    TWEEN.update();

    if (dragFlag) {
      counting++;
      if (counting > 15) isClick = true;
    }

    if (!enableKeyboard) return;
    keyMap["KeyW"] && camera.translateZ(-delta * moveSpeed);
    keyMap["KeyS"] && camera.translateZ(delta * moveSpeed);
    keyMap["KeyA"] && camera.translateX(-delta * moveSpeed);
    keyMap["KeyD"] && camera.translateX(delta * moveSpeed);
  });

  return (
    <>
      <mesh name="footprint" ref={footprintRef}>
        <planeGeometry args={[0.4, 0.4, 1, 1]} attach="geometry" />
        <meshBasicMaterial
          attach="material"
          map={tex2Dfootprint}
          alphaTest={true}
        />
      </mesh>
      <mesh name="floor" position={(0, 0, 0.3)} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry
          args={[props.sizex, props.sizey, 1, 1]}
          attach="geometry"
        />
        <meshBasicMaterial
          attach="material"
          color={0x00ff00}
          opacity={props.debug}
          transparent={true}
        />
      </mesh>
    </>
  );
});

export default FirstPerson;

import * as THREE from "three";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";

const moveSpeed = 0.025;
const dragSpeed = 0.4;

var keyPressed = [false, false, false, false];
var isClick = false;
var camrx = 0;
var camry = 0;
var camera;
var scene;
var dragFlag = false;
var counting = 0;

var EnableKeyboard = true;

export default class FirstPersonControls {
  constructor(_camera, _scene, _enableKeyboard) {
    camera = _camera;
    scene = _scene;
    EnableKeyboard = _enableKeyboard;
    this.Init();
  }

  Init() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleKeyDown = (e) => {
      if (e.key == "w") keyPressed[0] = true;
      if (e.key == "a") keyPressed[1] = true;
      if (e.key == "s") keyPressed[2] = true;
      if (e.key == "d") keyPressed[3] = true;
    };
    const handleKeyUp = (e) => {
      if (e.key == "w") keyPressed[0] = false;
      if (e.key == "a") keyPressed[1] = false;
      if (e.key == "s") keyPressed[2] = false;
      if (e.key == "d") keyPressed[3] = false;
    };

    document.onmousedown = function (e) {
      dragFlag = true;
    };

    document.onmouseup = function (e) {
      this.mx = 0;
      this.my = 0;
      dragFlag = false;
      counting = 0;

      if (isClick) {
        isClick = false;
      } else {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
          if (intersects[0].object.name == "") return;
          if (!intersects[0].object.name == "floor") return;

          const tween = new TWEEN.Tween(camera.position)
            .to(
              { x: intersects[0].point.x, y: 0.5, z: intersects[0].point.z },
              1000
            )
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .start();

          // console.log(intersects[0].object.name);
          // camera.position.set(
          //   intersects[0].point.x,
          //   0.5,
          //   intersects[0].point.z
          // );
        }
      }
    };

    document.onmousemove = function (e) {
      if (isClick) {
        this.mx = e.movementX;
        this.my = e.movementY;

        camry += ((-this.mx * Math.PI) / 180) * dragSpeed;
        camrx += ((-this.my * Math.PI) / 180) * dragSpeed;
        const euler = new THREE.Euler(0, 0, 0, "YXZ");
        euler.x = camrx;
        euler.y = camry;

        camera.quaternion.setFromEuler(euler);
      }
    };

    if (!EnableKeyboard) return;

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
  }

  Update() {
    TWEEN.update();
    if (dragFlag) {
      counting++;
      if (counting > 10) isClick = true;
    }

    if (!EnableKeyboard) return;

    if (keyPressed[0]) camera.translateZ(-moveSpeed);
    if (keyPressed[1]) camera.translateX(-moveSpeed);
    if (keyPressed[2]) camera.translateZ(moveSpeed);
    if (keyPressed[3]) camera.translateX(moveSpeed);
  }

  CreateWalkArea(debug = 0.1) {
    const geometry = new THREE.PlaneGeometry(10, 10, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      opacity: debug,
      transparent: true,
    });
    const floor = new THREE.Mesh(geometry, material);
    floor.rotation.set(-Math.PI / 2, 0, 0);
    floor.name = "floor";
    scene.add(floor);
  }
}

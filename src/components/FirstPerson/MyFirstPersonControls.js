import * as THREE from "three";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";

const moveSpeed = 0.02;
const dragSpeed = 0.4;

var keyPressed = [false, false, false, false];
var isClick = false;
var camrx = 0;
var camry = 0;
var camera;
var scene;
var dragFlag = false;
var counting = 0;
var height = 0.5;
var enableKeyboard = true;
var enable = true;

var runner;

export default class MyFirstPersonControls {
  static enable = true;

  constructor(_camera, _scene, _enableKeyboard) {
    camera = _camera;
    scene = _scene;
    enableKeyboard = _enableKeyboard;
    this.Init();
  }

  Init() {
    const raycaster_mover = new THREE.Raycaster();
    const mouse_move = new THREE.Vector2();

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
      if (enable) dragFlag = true;
    };

    // listener
    document.onmouseup = function (e) {
      if (!MyFirstPersonControls.enable) return;
      if (!enable) return;

      this.mx = 0;
      this.my = 0;
      dragFlag = false;
      counting = 0;

      if (isClick) {
        isClick = false;
      } else {
        const intersects = raycaster_mover.intersectObjects(scene.children);
        if (intersects.length > 0) {
          if (intersects[0].object.name == "") return;
          if (intersects[0].object.name == "floor") {
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

    document.onmousemove = function (e) {
      if (!MyFirstPersonControls.enable) return;
      if (!enable) return;
      if (isClick) {
        this.mx = e.movementX;
        this.my = e.movementY;

        camry += ((-this.mx * Math.PI) / 180) * dragSpeed;
        camrx += ((-this.my * Math.PI) / 180) * dragSpeed;
        const euler = new THREE.Euler(0, 0, 0, "YXZ");
        euler.x = camrx;
        euler.y = camry;
        camera.quaternion.setFromEuler(euler);
        runner.visible = false;
      } else {
        mouse_move.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse_move.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster_mover.setFromCamera(mouse_move, camera);
        const hits = raycaster_mover.intersectObjects(scene.children);
        runner.position.set(hits[0].point.x, 0.05, hits[0].point.z);
        runner.lookAt(
          camera.position.x,
          camera.position.y + 90,
          camera.position.z
        );

        runner.visible = true;
      }
    };

    if (!enableKeyboard) return;

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
  }

  CreateFootprint(scene) {
    // Init runner
    var runnerMaterial = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("icons/footprints.png"),
      alphaTest: true,
      side: THREE.DoubleSide,
    });
    var runnerGeometry = new THREE.PlaneGeometry(0.15, 0.15, 1, 1);
    runner = new THREE.Mesh(runnerGeometry, runnerMaterial);
    runner.position.set(-100, 100, 0);
    scene.add(runner);
  }

  Update() {
    if (!MyFirstPersonControls.enable) return;
    if (!enable) return;
    TWEEN.update();
    if (dragFlag) {
      counting++;
      if (counting > 15) isClick = true;
    }

    if (!enableKeyboard) return;
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
    floor.position.y = 0.1;
    floor.rotation.set(-Math.PI / 2, 0, 0);
    floor.name = "floor";
    scene.add(floor);
  }

  SetHeight(_value) {
    height = _value;
  }

  Enable(_value) {
    enable = _value;
  }
}

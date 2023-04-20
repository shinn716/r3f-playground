import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

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
var height = 1.7;
var enableKeyboard = true;
var enable = true;
var footprint;
var lastX, lastY;
var walkableHeight = 0.3;

export default class MyFirstPersonControls {
  constructor(_camera, _scene, _enableKeyboard) {
    camera = _camera;
    scene = _scene;
    enableKeyboard = _enableKeyboard;
    this.Init();
  }

  Init() {
    const raycaster_mover = new THREE.Raycaster();
    const raycaster_click = new THREE.Raycaster();
    const mouse_move = new THREE.Vector2();
    const pointer_click = new THREE.Vector2();

    const handleKeyDown = (e) => {
      if (e.key === "w") keyPressed[0] = true;
      if (e.key === "a") keyPressed[1] = true;
      if (e.key === "s") keyPressed[2] = true;
      if (e.key === "d") keyPressed[3] = true;
    };
    const handleKeyUp = (e) => {
      if (e.key === "w") keyPressed[0] = false;
      if (e.key === "a") keyPressed[1] = false;
      if (e.key === "s") keyPressed[2] = false;
      if (e.key === "d") keyPressed[3] = false;
    };

    // listener
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
        footprint.visible = false;

        lastX = e.clientX;
        lastY = e.clientY;
      } else {
        mouse_move.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse_move.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster_mover.setFromCamera(mouse_move, camera);
        const hits = raycaster_mover.intersectObjects(scene.children);
        if (footprint === undefined) return;
        if (hits[0] === undefined) return;
        footprint.position.set(hits[0].point.x, 0.05, hits[0].point.z);
        footprint.lookAt(
          camera.position.x,
          camera.position.y + 90,
          camera.position.z
        );
        footprint.visible = true;
      }
    };

    if (!enableKeyboard) return;

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
  }

  SetCamPosition(px, py, pz) {
    camera.position.set(px, py, pz);
  }

  SetCamRotation(ex, ey, ez) {
    camera.rotation.set(
      (ex * Math.PI) / 180,
      (ey * Math.PI) / 180,
      (ez * Math.PI) / 180
    );
  }

  // Init footprint
  CreateFootprint(scene) {
    var runnerMaterial = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(
        process.env.PUBLIC_URL + "/icons/footprints.png"
      ),
      alphaTest: true,
      side: THREE.DoubleSide,
    });
    var runnerGeometry = new THREE.PlaneGeometry(0.15, 0.15, 1, 1);
    footprint = new THREE.Mesh(runnerGeometry, runnerMaterial);
    footprint.position.set(-100, -100, 0);
    footprint.scale.set(3, 3, 3);
    scene.add(footprint);
  }

  Update() {
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

  CreateWalkArea(debug = 0.1, size = 10) {
    const geometry = new THREE.PlaneGeometry(size, size, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      opacity: debug,
      transparent: true,
    });
    const floor = new THREE.Mesh(geometry, material);
    floor.position.y = walkableHeight;
    floor.rotation.set(-Math.PI / 2, 0, 0);
    floor.name = "floor";
    scene.add(floor);
  }

  GetHeight() {
    return height;
  }

  SetHeight(_value) {
    height = _value;
  }

  Enable(_value) {
    enable = _value;
  }
}

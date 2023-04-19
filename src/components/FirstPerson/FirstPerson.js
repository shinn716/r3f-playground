import { useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useEffect, useImperativeHandle } from "react";

import MyFirstPersonControls from "./MyFirstPersonControls";

const FirstPerson = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    enable(value) {
      controller.Enable(value);
    },
    setPosition(px, py, pz) {
      controller.SetCamPosition(px, py, pz);
    },
    setRotation(rx, ry, rz) {
      controller.SetCamRotation(rx, ry, rz);
    },
    setHeight(height) {
      controller.SetHeight(height);
    },
    getHeight() {
      return controller.GetHeight();
    },
  }));

  const { camera } = useThree();
  const { scene } = useThree();
  const controller = new MyFirstPersonControls(camera, scene, true);

  useEffect(() => {
    controller.CreateFootprint(scene);
    controller.CreateWalkArea(0.1, 20);
  }, []);

  useFrame(() => {
    controller?.Update();
  });
});

export default FirstPerson;

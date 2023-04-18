import { useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useEffect, useImperativeHandle } from "react";

import MyFirstPersonControls from "./MyFirstPersonControls";

const FirstPerson = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    enable(value) {
      controller.Enable(value);
    },
  }));

  const { camera } = useThree();
  const { scene } = useThree();
  const controller = new MyFirstPersonControls(camera, scene, true);

  useEffect(() => {
    controller.CreateFootprint(scene);
    controller.CreateWalkArea(0.1);
  }, []);

  useFrame(() => {
    controller?.Update();
  });
});

export default FirstPerson;

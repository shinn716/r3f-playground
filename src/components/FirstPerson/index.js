import { useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useEffect, useImperativeHandle } from "react";

import MyFirstPersonControls from "./MyFirstPersonControls";

// eslint-disable-next-line react/display-name
const FirstPerson = forwardRef((props, ref) => {
  const { camera } = useThree();
  const { scene } = useThree();
  let controller;

  useImperativeHandle(ref, () => ({
    enable(_value) {
      controller.Enable(_value);
    },
  }));

  useEffect(() => {
    // console.log("init");
    // controller.Enable(false);

    controller = new MyFirstPersonControls(camera, scene, true);
    controller.CreateFootprint(scene);
    controller.CreateWalkArea(0);
  }, []);
  useFrame(() => {
    controller?.Update();
  });

  return controller?.Enable(props.enable);
});

export default FirstPerson;

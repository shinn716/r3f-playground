import { useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useEffect, useImperativeHandle } from "react";

import MyFirstPersonControls from "./MyFirstPersonControls";

// eslint-disable-next-line react/display-name
const FirstPerson = forwardRef((props, ref) => {
  const { camera } = useThree();
  const { scene } = useThree();
  const controller = new MyFirstPersonControls(camera, scene, true);

  useImperativeHandle(ref, () => ({
    enable(_value) {
      controller.Enable(_value);
    },
  }));

  useEffect(() => {
    // console.log("init");
    // controller.Enable(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    controller.CreateFootprint(scene);
    controller.CreateWalkArea(0.1);
    controller.Enable(true);
  }, []);
  useFrame(() => {
    controller?.Update();
  });

  return controller?.Enable(props.enable);
});

export default FirstPerson;

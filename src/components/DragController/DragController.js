import { DragControls } from "three/examples/jsm/controls/DragControls";
import { useThree } from "@react-three/fiber";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { Utils } from "./Utils";

const DragController = forwardRef((props, ref) => {
  const { camera, gl } = useThree();
  const { scene } = useThree();
  let px, py, pz;

  useImperativeHandle(ref, () => ({
    init(objs, dragstart, dragend) {
      const controls = new DragControls(objs, camera, gl.domElement);
      controls.addEventListener("dragstart", function (event) {
        dragstart();
      });

      controls.addEventListener("dragend", function (event) {
        dragend();
      });

      controls.addEventListener("drag", function (event) {
        const raycaster = controls.getRaycaster();
        const hits = raycaster.intersectObjects(scene.children);

        if (hits[0] === undefined) return;

        if (
          hits[0].object.name !== "floor" &&
          hits[0].object.name !== "" &&
          hits[0].object.name !== "cube"
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
    },
  }));
});

export default DragController;

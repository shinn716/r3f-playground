import { DragControls } from "three/examples/jsm/controls/DragControls";
import { useThree } from "@react-three/fiber";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import { Utils } from "./Utils";
import { Vector3 } from "three";

const DragController = forwardRef((props, ref) => {
  const { camera, gl } = useThree();
  const { scene } = useThree();
  const mypoint = useMemo(() => new Vector3(0, 0, 0), []);
  // let px, py, pz;

  let px = useMemo(() => 0, []);
  let py = useMemo(() => 0, []);
  let pz = useMemo(() => 0, []);

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
        const hits = raycaster.intersectObjects(scene.children, true);

        if (hits[0] === undefined) return;

        if (
          hits[0].object.name !== "floor" &&
          hits[0].object.name !== "" &&
          hits[0].object.name !== "cube"
        ) {
          mypoint.set(hits[0].point.x, hits[0].point.y, hits[0].point.z);
          event.object.position.set(mypoint.x, mypoint.y, mypoint.z);
          px = mypoint.x;
          py = mypoint.y;
          pz = mypoint.z;

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

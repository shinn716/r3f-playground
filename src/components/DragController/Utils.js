import * as THREE from "three";

export class Utils {
  // https://codepen.io/prisoner849/pen/dwzyrP
  static CalcuteNormalDirection(hits) {
    const poi = new THREE.Vector3();
    const n = new THREE.Vector3();
    const la = new THREE.Vector3();
    const i0 = hits;
    const obj = i0.object;

    if (i0.face == null) return;

    poi.copy(i0.point);
    n.copy(i0.face.normal);
    n.transformDirection(obj.matrixWorld);
    la.copy(poi).add(n);

    return la;
  }
}

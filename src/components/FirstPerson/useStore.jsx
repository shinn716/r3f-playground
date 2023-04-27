import { proxy } from "valtio";
import { useProxy } from "valtio/utils";

const store = proxy({ enableFPSControls: true });
export const useStore = () => useProxy(store);

import "./index.css";
import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Main } from "./Main";

createRoot(document.getElementById("root")).render(
  <Canvas dpr={[1, 1.5]} shadows camera={{ position: [0, 0, 100], fov: 30 }}>
    <Main />
  </Canvas>
);

import "./index.css";
import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Main } from "./Main";

createRoot(document.getElementById("root")).render(
  <Canvas>
    <Main />
  </Canvas>
);

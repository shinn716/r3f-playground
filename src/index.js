import "./index.css";
import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Main } from "./Main";
import { Html, useProgress } from "@react-three/drei";
import { Suspense } from "react";

function Loader() {
  const { progress } = useProgress();
  return <Html center>{Math.floor(progress)} % loaded</Html>;
}

createRoot(document.getElementById("root")).render(
  <Canvas>
    <Suspense fallback={<Loader />}>
      <Main />
    </Suspense>
  </Canvas>
);

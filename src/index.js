import "./index.css";
import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Main } from "./Main";
import { Html, useProgress } from "@react-three/drei";
import { Suspense } from "react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";

function Loader() {
  const { progress } = useProgress();
  return <Html center>{Math.floor(progress)} % loaded</Html>;
}

ReactDOM.createRoot(document.querySelector("#root")).render(
  <React.StrictMode>
    <div className="dashboard">
      <Canvas>
        <Suspense fallback={<Loader />}>
          <Main />
        </Suspense>
      </Canvas>
    </div>
    <div className="overlay" style={{ fontSize: 60 }}>
      Apartment
    </div>
  </React.StrictMode>
);

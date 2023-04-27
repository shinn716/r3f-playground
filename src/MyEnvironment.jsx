import { Environment, Sky } from "@react-three/drei";

const useSky = false;

export function MyEnvironment() {
  return useSky ? (
    <Sky />
  ) : (
    <>
      <Environment
        background={"only"}
        files={process.env.PUBLIC_URL + "textures/bg.hdr"}
      />
      <Environment
        background={false}
        files={process.env.PUBLIC_URL + "textures/envmap.hdr"}
      />
    </>
  );
}

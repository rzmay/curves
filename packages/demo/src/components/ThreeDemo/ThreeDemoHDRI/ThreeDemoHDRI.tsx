import React, { useEffect } from 'react';
import * as THREE from 'three';
import { useLoader, useThree } from 'react-three-fiber';

interface ThreeDemoHDRIProps {
    urls: string[];
    exposure?: number;
    background?: boolean;
    texture?: THREE.Texture;
    onLoad?: (texture: THREE.Texture) => any;
}

function loadHDRI(urls: string[], gl: THREE.WebGLRenderer, onLoad: (texture: THREE.Texture) => any) {
  // @ts-ignore
  const [cubeMap] = useLoader(THREE.CubeTextureLoader, [urls]);
  useEffect(() => {
    const gen = new THREE.PMREMGenerator(gl);
    gen.compileEquirectangularShader();
    const hdrCubeRenderTarget = gen.fromCubemap(cubeMap);
    cubeMap.dispose();
    gen.dispose();

    onLoad(hdrCubeRenderTarget.texture);
  }, [cubeMap]);
}

function ThreeDemoHDRI(props: ThreeDemoHDRIProps): React.ReactElement {
  const { gl, scene } = useThree();

  const onTextureLoad = (texture) => {
    if (props.background ?? true) scene.background = texture;
    scene.environment = texture;
    gl.toneMappingExposure = props.exposure ?? 1.0;

    if (props.onLoad) props.onLoad(texture);
  };

  if (props.texture) {
    onTextureLoad(props.texture);
  } else {
    loadHDRI(props.urls, gl, onTextureLoad);
  }

  return (
    <mesh />
  );
}

export default ThreeDemoHDRI;
export { loadHDRI };

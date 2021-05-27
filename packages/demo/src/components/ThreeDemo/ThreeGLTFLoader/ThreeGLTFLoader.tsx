import React, { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from 'react-three-fiber';

interface ThreeGLTFLoaderProps {
    url: string;
    onLoad?: (ref: React.MutableRefObject<THREE.Group | undefined>) => any;

    clone?: boolean;

    castShadow?: boolean;
    receiveShadow?: boolean;
}

function ThreeGLTFLoader(props: ThreeGLTFLoaderProps): React.ReactElement {
  const gltf = useLoader(GLTFLoader, props.url);
  const ref = useRef<THREE.Group>();

  function setCastShadow(object: THREE.Object3D, castShadow = true, receiveShadow = true) {
    object.castShadow = castShadow;
    object.receiveShadow = receiveShadow;

    object.children.forEach((child) => {
      setCastShadow(child, castShadow, receiveShadow);
    });
  }

  useEffect(() => {
    if (props.onLoad) props.onLoad(ref);
  }, []);

  setCastShadow(gltf.scene, props.castShadow, props.receiveShadow);

  return (
    <primitive /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...props}
      ref={ref}
      object={(props.clone ?? false) ? gltf.scene.clone() : gltf.scene}
    />
  );
}

export default ThreeGLTFLoader;

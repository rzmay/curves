import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import * as images from '../assets/images/*.*';

interface ThreeDemoFloorProps {
    material?: THREE.Material;
    width?: number;
    length?: number;
}

function ThreeDemoFloor(props: ThreeDemoFloorProps): React.ReactElement {
  const floorGeometry = new THREE.PlaneGeometry(props.width ?? 50, props.length ?? 50, 10, 10);
  const mesh = useRef<THREE.Mesh>();
  const [defaultMaterial] = useState(new THREE.MeshPhysicalMaterial({
    roughness: 0.65,
    color: 0x444444,
    side: THREE.DoubleSide,
  }));

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(images.checkerboard.jpg, (map) => {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(50, 50);

    defaultMaterial.map = map;
    defaultMaterial.needsUpdate = true;
  });

  useEffect(() => {
    if (mesh !== undefined && mesh.current !== undefined) {
      // @ts-ignore
      mesh.current.position.set(0, 0, 0);

      // @ts-ignore
      mesh.current.rotation.x = Math.PI / 2;
    }
  }, []);

  return (
    <mesh
      ref={mesh}
      geometry={floorGeometry}
      material={props.material ?? defaultMaterial}
      receiveShadow
    />
  );
}

export default ThreeDemoFloor;

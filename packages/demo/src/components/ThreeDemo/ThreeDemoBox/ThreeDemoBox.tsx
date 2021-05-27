import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from 'react-three-fiber';

function ThreeDemoBox(props) {
  const mesh = useRef();

  return (
    <mesh /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...props}
      ref={mesh}
      material={props.material ?? new THREE.MeshPhysicalMaterial({ color: 'blue' })}
      castShadow
    >
      <boxBufferGeometry attach="geometry" args={[2, 2, 2]} />
    </mesh>
  );
}

export default ThreeDemoBox;

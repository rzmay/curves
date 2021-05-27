import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame, extend, useThree } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

extend({ OrbitControls });

interface CameraControlsProps {
  fov?: number
  zoomSpeed?: number;
  rotationSpeed?: number;
}

function CameraControls(props): React.ReactElement {
  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls class.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls

  const {
    scene,
    camera,
    gl: { domElement },
  } = useThree();

  // Ref to the controls, so that we can update them on every frame using useFrame
  const controls = useRef();

  useEffect(() => {
    // FOV
    if (camera instanceof THREE.PerspectiveCamera) camera.fov = props.fov ?? 40;
    // Position camera
    camera.position.set(0, 5, 10);
    camera.lookAt(scene.position);
  }, []);

  // @ts-ignore
  useFrame((state) => controls.current.update());
  return (
  // @ts-ignore
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      zoomSpeed={props.zoomSpeed ?? 0.75}
      rotateSpeed={props.rotationSpeed ?? 0.25}
    />
  );
}

export default CameraControls;

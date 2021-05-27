import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, extend } from 'react-three-fiber';
import * as THREE from 'three';
import './ObjectThreeJSDemo.scss';
import Slider from '@material-ui/core/Slider';
import { Curve, Modifiers } from 'curves';
import ThreeDemoFloor from '../../../ThreeDemo/ThreeDemoFloor/ThreeDemoFloor';
import CameraControls from '../../../ThreeDemo/CameraControls/CameraControls';
import ThreeDemoHDRI from '../../../ThreeDemo/ThreeDemoHDRI/ThreeDemoHDRI';
import LoadMultiple from '../../../ThreeDemo/LoadMultiple/LoadMultiple';
import ThreeDemoCar from './ThreeDemoCar/ThreeDemoCar';

// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import * as images from '../../../../assets/images/*.*';

// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import * as models from '../../../../assets/models/*.glb';

interface ObjectThreeJSDemoProps {
  curve: React.RefObject<Curve<object>>;
  onTimeChange: (time: number) => void;
  steps?: number;
}

function ObjectThreeJSDemo(props: ObjectThreeJSDemoProps): React.ReactElement {
  const [time, setTime] = useState(0);
  const [hdri, setHDRI] = useState<THREE.Texture>();
  if (!props.curve.current) return <div>No curve</div>;

  const duration = (props.curve.current.duration + props.curve.current.startTime);
  const stepTime = duration / (props.steps ?? 100);

  function onTimeChange(t: number) {
    setTime(t);
    props.onTimeChange(t);
  }

  const handleChange = (event: any, newValue: number | number[]) => {
    onTimeChange(newValue as number);
  };

  const [floorMaterial] = useState(new THREE.MeshPhysicalMaterial({
    roughness: 0.65,
    color: 0xc2d5ff,
    normalScale: new THREE.Vector2(1, 1),
    side: THREE.DoubleSide,
  }));

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();

    // Floor
    function setFloorWrapping(map) {
      map.wrapS = THREE.RepeatWrapping;
      map.wrapT = THREE.RepeatWrapping;
      map.anisotropy = 4;
      map.repeat.set(3, 3);
    }
    textureLoader.load(images.ground_grey_diff_1k.jpg, (map) => {
      setFloorWrapping(map);
      floorMaterial.map = map;
      floorMaterial.needsUpdate = true;
    });
    textureLoader.load(images.ground_grey_nor_1k.jpg, (map) => {
      setFloorWrapping(map);
      floorMaterial.normalMap = map;
      floorMaterial.needsUpdate = true;
    });
    textureLoader.load(images.ground_grey_rough_1k.jpg, (map) => {
      setFloorWrapping(map);
      floorMaterial.roughnessMap = map;
      floorMaterial.needsUpdate = true;
    });
    textureLoader.load(images.ground_grey_ao_1k.jpg, (map) => {
      setFloorWrapping(map);
      floorMaterial.aoMap = map;
      floorMaterial.needsUpdate = true;
    });
  }, []);

  return (
    <div className="object-demo-container">
      <div className="object-demo-canvas-container">
        <Canvas className="three-fiber-canvas" shadowMap>
          <pointLight position={[10, 20, 0]} intensity={1} castShadow />
          <ambientLight />
          <CameraControls />
          <ThreeDemoFloor material={floorMaterial} />

          <ThreeDemoCar
            carSettings={props.curve.current.evaluate(time)}
          />
          <LoadMultiple
            url={models.easel}

            objects={[{
              position: [5, 0, 18],
              scale: [3, 3, 3],
              rotation: [0, 210, 0].map((deg) => deg * (Math.PI / 180)),
            },
            {
              position: [-1, 0, 18],
              scale: [3, 3, 3],
              rotation: [0, 190, 0].map((deg) => deg * (Math.PI / 180)),
            },
            {
              position: [-4, 0, -18],
              scale: [3, 3, 3],
              rotation: [0, 20, 0].map((deg) => deg * (Math.PI / 180)),
            },
            ]}
          />
          <LoadMultiple
            url={models.cone}

            objects={[{
              position: [-4, 0, 18],
              scale: [4, 4, 4],
              rotation: [0, 210, 0].map((deg) => deg * (Math.PI / 180)),
            },
            {
              position: [-8, 0, 12],
              scale: [4, 4, 4],
              rotation: [0, 190, 0].map((deg) => deg * (Math.PI / 180)),
            },
            ]}
          />
          <LoadMultiple
            url={models.cone_large}

            objects={[{
              position: [-7, 0, 20],
              scale: [3, 3, 3],
              rotation: [0, 210, 0].map((deg) => deg * (Math.PI / 180)),
            },
            {
              position: [-9, 0, -15],
              scale: [3, 3, 3],
              rotation: [0, 190, 0].map((deg) => deg * (Math.PI / 180)),
            },
            {
              position: [3, 0, -14],
              scale: [3, 3, 3],
              rotation: [0, 20, 0].map((deg) => deg * (Math.PI / 180)),
            },
            ]}
          />

          <Suspense fallback={null}>
            <ThreeDemoHDRI
              urls={[
                images.q_px.png,
                images.q_nx.png,
                images.q_py.png,
                images.q_ny.png,
                images.q_pz.png,
                images.q_nz.png,
              ]}
              onLoad={setHDRI}
              background
            />
          </Suspense>
        </Canvas>
      </div>
      <div className="time-slider-container">
        <h5>Adjust Time</h5>
        <br />
        <Slider
          defaultValue={props.curve.current.startTime}
          onChange={handleChange}
          step={stepTime}
          min={props.curve.current.startTime}
          max={props.curve.current.endTime}
        />
      </div>
    </div>
  );
}

export default ObjectThreeJSDemo;

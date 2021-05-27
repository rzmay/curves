import React, { Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from 'react-three-fiber';
import ThreeGLTFLoader from '../../../../ThreeDemo/ThreeGLTFLoader/ThreeGLTFLoader';
import DemoCarWrapper from './scripts/DemoCarWrapper';
import { DemoCarSettings } from './scripts/DemoCarSettings';

// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import * as models from '../../../../../assets/models/*.glb';

interface ThreeDemoCarProps {
    carSettings: DemoCarSettings;
}

function ThreeDemoCar(props: ThreeDemoCarProps): React.ReactElement {
  const [car, setCar] = useState<DemoCarWrapper>();
  let time = new Date().getTime();

  useFrame(() => {
    if (!car) return;

    const t = new Date().getTime();
    const deltaTime = t - time;
    time = t;

    car.update(deltaTime);
  });

  useEffect(() => {
    if (!car) return;

    car.updateSettings(props.carSettings);
  }, [props.carSettings]);

  return (
    <Suspense fallback={null}>
      <ThreeGLTFLoader
        url={models.car}
        onLoad={(ref: React.MutableRefObject<THREE.Group | undefined>) => {
          if (!ref.current) return;

          const newCar = new DemoCarWrapper(ref.current);
          newCar.updateSettings(props.carSettings ?? {});
          setCar(newCar);
        }}

        // @ts-ignore
        position={[0, 0.5, 0]}

        receiveShadow={false}
      />
    </Suspense>
  );
}

export default ThreeDemoCar;

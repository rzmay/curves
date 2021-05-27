import React, { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import ThreeGLTFLoader from '../ThreeGLTFLoader/ThreeGLTFLoader';

interface LoadMultipleProps {
    url: string;
    onLoad?: (ref: React.MutableRefObject<THREE.Group | undefined>) => any;

    objects: object[];
}

function LoadMultiple(props: LoadMultipleProps): React.ReactElement {
  return (
    <Suspense fallback={null}>
      {props.objects.map((object) => (
        <ThreeGLTFLoader /* eslint-disable-next-line react/jsx-props-no-spreading */
          {...object}
          url={props.url}
          onLoad={props.onLoad}
          key={Math.random()}
          clone
        />
      ))}
    </Suspense>
  );
}

export default LoadMultiple;

import { useState } from 'react';

function useForceUpdate(): [number, () => void] {
  const [value, setValue] = useState(0); // integer state
  return [value, () => setValue((val) => val + 1)]; // update the state to force render
}

export default useForceUpdate;

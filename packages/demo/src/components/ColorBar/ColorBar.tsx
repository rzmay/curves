import React, { useState, useEffect } from 'react';
import './ColorBar.scss';
import { RGBColor } from 'curves';

function ColorBar(props: any): React.ReactElement {
  const [colorStops, setColorStops] = useState('white 0%, black 100%');

  useEffect(() => {
    const stops: string[] = [];
    const colorKeys: {color: RGBColor, time: number}[] = props.colors
            ?? [{ color: { r: 0, g: 0, b: 0 }, time: 0 }, { color: { r: 255, g: 255, b: 255 }, time: 1 }];

    colorKeys.forEach((c) => {
      stops.push(`rgb(${c.color.r}, ${c.color.g}, ${c.color.b}) ${c.time * 100}%`);
    });

    setColorStops(stops.join(', '));
  }, [props.colors]);

  return (
    <div className="colorbar-container">
      <div className="colorbar" style={{ backgroundImage: `linear-gradient(to right, ${colorStops})` }} />
    </div>
  );
}

export default ColorBar;

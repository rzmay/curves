import React, { useState } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { BlockPicker } from 'react-color';
import { RGBColor } from 'curves';
import { KeyframeValueInputProps } from '../../CurveDemo/CurveEditor/KeyframeEditor/KeyframeValueInput/KeyframeValueInput';
import './RGBColorKeyframeValueInput.scss';

function RGBColorKeyframeValueInput(props: KeyframeValueInputProps<RGBColor>) {
  const [color, setColor] = useState(`rgb(${props.defaultValue.r}, ${props.defaultValue.g}, ${props.defaultValue.b}`);

  function colorToString(c: RGBColor) {
    return `rgb(${c.r}, ${c.g}, ${c.b}`;
  }

  return (
    <div className="rgb-input-swatch">
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        overlay={(
          <Popover id={`color-picker-popover-${Math.random()}`}>
            <Popover.Content>
              <BlockPicker
                color={color}
                onChange={(c) => {
                  props.onChange(c.rgb as RGBColor);
                  setColor(colorToString(c.rgb));
                }}
              />
            </Popover.Content>
          </Popover>
        )}
        rootClose
      >
        <div className="rgb-input-swatch-color" style={{ backgroundColor: color }} />
      </OverlayTrigger>
    </div>
  );
}

export default RGBColorKeyframeValueInput;

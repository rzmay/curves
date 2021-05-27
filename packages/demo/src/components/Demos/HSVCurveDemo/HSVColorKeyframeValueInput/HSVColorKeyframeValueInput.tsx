import React, { useState } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { BlockPicker } from 'react-color';
import { ColorHelper, HSVColor, RGBColor } from 'curves';
import { KeyframeValueInputProps } from '../../CurveDemo/CurveEditor/KeyframeEditor/KeyframeValueInput/KeyframeValueInput';
import './HSVColorKeyframeValueInput.scss';

function HSVColorKeyframeValueInput(props: KeyframeValueInputProps<HSVColor>) {
  function colorToString(c: HSVColor) {
    const cRGB = ColorHelper.HSVtoRGB(c);
    return `rgb(${cRGB.r}, ${cRGB.g}, ${cRGB.b}`;
  }

  const [color, setColor] = useState(colorToString(props.defaultValue));

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
                  const hsv = ColorHelper.RGBtoHSV(c.rgb as RGBColor);
                  props.onChange(hsv as HSVColor);
                  setColor(colorToString(hsv));
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

export default HSVColorKeyframeValueInput;

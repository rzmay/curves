import colorString from 'color-string';
import { Easing } from 'eaz';
import Keyframe from './Keyframe';
import NumberKeyframe from './NumberKeyframe';
import BooleanKeyframe from './BooleanKeyframe';
import StringKeyframe from './StringKeyframe';
import RGBColorKeyframe from './RGBColorKeyframe';
import { Vector3Keyframe } from '../../index';

class ObjectKeyframe extends Keyframe<object> {
  protected conversionMethods: {
    'number': (key: any) => Keyframe<number>,
    'string': (key: any) => Keyframe<string>,
    'boolean': (key: any) => Keyframe<boolean>,
    'object': (key: any) => Keyframe<object>,
  };

  constructor(
    time: number,
    value: object,
    inEasing: Easing = Easing.cubic,
    outEasing: Easing | undefined = undefined,
  ) {
    super(time, value, inEasing, outEasing);

    this.conversionMethods = {
      number: this.numberKeyframe,
      string: this.stringKeyframe,
      boolean: this.booleanKeyframe,
      object: this.objectKeyframe,
    };
  }

  interpolate(keyframe: ObjectKeyframe, time: number): object {
    const result: object = {};

    const keysWithDuplicates = Object.keys(this.value).concat(Object.keys(keyframe.value));
    const keys = keysWithDuplicates.filter((elem, pos) => keysWithDuplicates.indexOf(elem) === pos);

    keys.forEach((key) => {
      // If null, interpolate from next keyframe
      if (this.value[key] === undefined) {
        result[key] = keyframe._interpolateKey(this, key, 1 - time);
      } else {
        result[key] = this._interpolateKey(keyframe, key, time);
      }
    });

    return result;
  }

  protected _interpolateKey(keyframe: ObjectKeyframe, key: any, time: number): any {
    let result: any;

    // Check if value is color string
    if (typeof this.value[key] === 'string' && colorString.get(this.value[key]) !== null) {
      const color = colorString.get(this.value[key]);
      /*
       * Solve with Vec3 keyframes
       * conversion back to original color model fixes discrepancies
       * really all that's necessary is a Vector3 keyframe, rgb works
       */
      const currentColor = this.colorKeyframe(key);
      const nextColor = keyframe.colorKeyframe(key);

      const colorResult = currentColor.color.interpolate(nextColor.color, time);
      const alphaResult = currentColor.alpha.interpolate(nextColor.alpha, time);

      // Convert back to color string, set value
      result = colorString.to[color.model](
        [colorResult.x, colorResult.y, colorResult.z],
        alphaResult,
      );

      return result;
    }

    // Otherwise check primitives
    Object.keys(this.conversionMethods).forEach((type) => {
      // eslint-disable-next-line valid-typeof
      if (typeof this.value[key] === type) {
        result = this.conversionMethods[type].bind(this)(key).interpolate(
          keyframe.conversionMethods[type].bind(keyframe)(key),
          time,
        );

        /* If checking object, check if array
        * CONDITIONS:
        * This key is array OR next key is array
        * All keys in this object are integers (indices)
       */
        const isInt = (n: string): boolean => !isNaN(parseInt(n, 10)) && parseInt(n, 10) === parseFloat(n);
        if (
          type === 'object'
          && (Array.isArray(this.value[key]) || Array.isArray(keyframe.value[key]))
          && Object.keys(this.value[key]).every(isInt)
        ) {
          // Convert to array
          result = Object.values(result);
        }
      }
    });

    return result;
  }

  booleanKeyframe(key: any): BooleanKeyframe {
    if (this.value[key] === undefined
        || typeof this.value[key] !== 'boolean'
    ) {
      return new BooleanKeyframe(this.time, false, this.inEasing, this.outEasing);
    }

    return new BooleanKeyframe(
      this.time,
      this.value[key] as boolean,
      this.inEasing,
      this.outEasing,
    );
  }

  numberKeyframe(key: any): NumberKeyframe {
    if (this.value[key] === undefined
            || typeof this.value[key] !== 'number'
    ) {
      return new NumberKeyframe(this.time, 0, this.inEasing, this.outEasing);
    }

    return new NumberKeyframe(this.time, this.value[key] as number, this.inEasing, this.outEasing);
  }

  stringKeyframe(key: any): StringKeyframe {
    if (this.value[key] === undefined
        || typeof this.value[key] !== 'string'
    ) {
      return new StringKeyframe(this.time, '', this.inEasing, this.outEasing);
    }

    return new StringKeyframe(this.time, this.value[key] as string, this.inEasing, this.outEasing);
  }

  objectKeyframe(key: any): ObjectKeyframe {
    if (this.value[key] === undefined
        || typeof this.value[key] !== 'object'
    ) {
      return new ObjectKeyframe(this.time, {}, this.inEasing, this.outEasing);
    }

    return new ObjectKeyframe(this.time, this.value[key] as object, this.inEasing, this.outEasing);
  }

  colorKeyframe(key: any): { color: Vector3Keyframe, alpha: NumberKeyframe } {
    const color = colorString.get(this.value[key] ?? 'invalid key');

    if (this.value[key] === undefined
      || typeof this.value[key] !== 'string'
      || color === null) {
      return {
        color: new Vector3Keyframe(
          this.time,
          { x: 255, y: 255, z: 255 },
          this.inEasing,
          this.outEasing,
        ),
        alpha: new NumberKeyframe(this.time, 1, this.inEasing, this.outEasing),
      };
    }

    return {
      color: new Vector3Keyframe(
        this.time,
        { x: color.value[0], y: color.value[1], z: color.value[2] },
        this.inEasing,
        this.outEasing,
      ),
      alpha: new NumberKeyframe(this.time, color.value[3], this.inEasing, this.outEasing),
    };
  }
}

export default ObjectKeyframe;

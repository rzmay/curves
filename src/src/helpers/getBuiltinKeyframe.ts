import BooleanKeyframe from '../keyframes/BooleanKeyframe';
import HSVColorKeyframe from '../keyframes/HSVColorKeyframe';
import ListKeyframe from '../keyframes/ListKeyframe';
import NumberKeyframe from '../keyframes/NumberKeyframe';
import ObjectKeyframe from '../keyframes/ObjectKeyframe';
import RGBColorKeyframe from '../keyframes/RGBColorKeyframe';
import StringKeyframe from '../keyframes/StringKeyframe';
import Vector3Keyframe from '../keyframes/Vector3Keyframe';

function hasNumericComponents(value: unknown, components: readonly string[]): boolean {
  return typeof value === 'object' && value !== null
    && components.every((key) => typeof (value as Record<string, unknown>)[key] === 'number');
}

export function getBuiltinKeyframe(values: readonly unknown[]) {
  if (values.length === 0) return ObjectKeyframe;
  if (values.every((value) => typeof value === 'number')) return NumberKeyframe;
  if (values.every((value) => typeof value === 'boolean')) return BooleanKeyframe;
  if (values.every((value) => typeof value === 'string')) return StringKeyframe;
  if (values.every((value) => Array.isArray(value) && value.every((element) => typeof element === 'number'))) {
    return ListKeyframe;
  }
  if (values.every((value) => hasNumericComponents(value, ['x', 'y', 'z']))) return Vector3Keyframe;
  if (values.every((value) => hasNumericComponents(value, ['r', 'g', 'b']))) return RGBColorKeyframe;
  if (values.every((value) => hasNumericComponents(value, ['h', 's', 'v']))) return HSVColorKeyframe;
  return ObjectKeyframe;
}

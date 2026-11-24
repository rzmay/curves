import type { Easing } from 'eaz';
import type CurveModifier from '../CurveModifier';
import type EndBehavior from '../EndBehavior';
import type Keyframe from '../keyframes/Keyframe';
import { getBuiltinKeyframe } from './getBuiltinKeyframe';

export type KeyframeMap<T> = {
  readonly [time: number]: T | readonly [T, Easing];
  readonly keyframe?: new (time: number, value: T, ...args: any[]) => Keyframe<T>;
  readonly modifiers?: CurveModifier<T>[];
  readonly endBehavior?: EndBehavior;
  readonly smoothing?: number;
};

export function normalizeKeyframeMap<T>({ keyframe, modifiers, endBehavior, smoothing, ...timestamps }: KeyframeMap<T>) {
  const entries = Object.keys(timestamps).map((timestamp): [number, T, Easing?] => {
    const time = Number(timestamp);
    const entry = timestamps[timestamp as `${number}`];
    // Number arrays are bare values. A pair with an object in its second slot supplies easing.
    return Array.isArray(entry) && entry.length === 2 && typeof entry[1] === 'object' && entry[1] !== null
      ? [time, entry[0] as T, entry[1] as Easing]
      : [time, entry as T];
  });
  const KeyframeType = (keyframe ?? getBuiltinKeyframe(entries.map(([, value]) => value))) as
    NonNullable<KeyframeMap<T>['keyframe']>;

  return {
    keys: entries.map((entry) => new KeyframeType(...entry)),
    modifiers,
    endBehavior,
    smoothing,
  };
}

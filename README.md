# Curves

##### 📈 Easily define and evaluate eased curves, similar to Unity's AnimationCurves with modifiers akin to Blender's FCurve Modifiers.

Installation:
```npm i curves```

#### [npm](https://www.npmjs.com/package/curves) ![npmlogo](https://raw.githubusercontent.com/npm/logos/master/npm%20square/npm-16.png)
#### [documentation](http://robertzmay.com/curves-documentation/) 📖
#### [Live Demo](http://robertzmay.com/curves-demo/) 📉

<!-- CURVES_BENCHMARKS_START -->
### Curves Benchmarks

Generated with `npm run benchmark:curves:update` on Node `v24.21.0`.

| Case | Evaluations | Total ms | Ops/sec | Checksum |
| --- | ---: | ---: | ---: | ---: |
| constant-number-baseline | 200,000 | 0.448 | 446,470,428 | 8400000.000000 |
| simple-function-baseline | 200,000 | 1.576 | 126,886,726 | 999600.000000 |
| numeric-keyframe-curve | 200,000 | 49.452 | 4,044,298 | 274900.000000 |
| vector3-like-curve | 200,000 | 47.868 | 4,178,124 | 1498500.000000 |
| color-like-curve | 200,000 | 46.713 | 4,281,418 | 77852500.000000 |
| curve-with-modifiers-composition | 200,000 | 93.094 | 2,148,357 | 15134.392568 |
| object-keyframe-curve | 200,000 | 3901.191 | 51,266 | 9896900.000000 |
<!-- CURVES_BENCHMARKS_END -->

---

### Easily Define and Evaluate Curves

Constructing curves is simple, and evaluating them is even simpler.

```typescript
import { Curve, NumberKeyframe } from 'curves';

const curve: Curve<number> = new Curve<number>(
    [
        new NumberKeyframe(0, 0),
        new NumberKeyframe(1, 2),
        new NumberKeyframe(5, 1),
    ], // Keyframes
);

// Expected output: 
//    time: 0, value: 0
//    time: 1, value: 2
//    time: 2, value: 1.9375
//    time: 3, value: 1.5
//    time: 4, value: 1.0625
//    time: 5, value: 1
for (let i = 0; i < 5; i += 1) {
    console.log(`time: ${i}, value: ${curve.evaluate(i)}`)
}
```

### Timestamp Shorthand

Pass a timestamp map as the first argument to `Curve`. Each entry can be a value or `[value, easing]`. Bare values use the keyframe constructor's default easing.

```typescript
import { Curve, EndBehavior, Modifiers, ObjectKeyframe } from 'curves';
import { Easing } from 'eaz';

const speed = new Curve({
    0: 0,
    0.5: [8, Easing.linear],
    2: 12,
    modifiers: [new Modifiers.Number.Clamp(0, 10)],
    endBehavior: EndBehavior.Loop,
    smoothing: 0.25,
});
const path = new Curve({
    '-0.5': { x: 0, y: 0, z: 0 },
    1: { x: 2, y: 3, z: 4 },
});

// Choose object interpolation explicitly for vector-shaped data with extra fields.
const points = new Curve({
    keyframe: ObjectKeyframe,
    0: { x: 0, y: 0, z: 0, size: 1 },
    1: { x: 2, y: 3, z: 4, size: 2 },
});

const fade = Curve.decreaseFloat(Easing.linear);
```

Use finite numeric timestamps as property keys. Numbers, booleans, strings, and number arrays use their corresponding built-ins when all entries match. For objects, the constructor looks for numeric `x`, `y`, and `z` on every value first, then `r`, `g`, and `b` for RGB, then `h`, `s`, and `v` for HSV. If no specialized type fits every entry, the curve uses `ObjectKeyframe`.

In TypeScript, specify `Curve<number[]>` for number arrays so the compiler can distinguish arrays from easing pairs. Nest an eased array inside its pair, as in `new Curve<number[]>({ 0: [1, 2], 1: [[3, 4], Easing.linear] })`. A two-item array with an object in the second slot is read as an easing pair.

Set `modifiers`, `endBehavior`, and `smoothing` directly in the timestamp map. A supplied positional argument takes precedence over the corresponding map option. Passing `undefined` in a position uses the map option or the usual default.

The `keyframe` override receives the time and value. Use easing pairs with constructors that accept easing as their third argument. Use a keyframe array for per-key constructors, separate in/out easing, or custom Bézier handles. `increaseFloat`, `decreaseFloat`, `increaseColor`, and `decreaseColor` each accept optional easing.

### Cast Evaluation Results

Call `.cast()` to convert the result of evaluating a curve. The returned view shares the original curve's keys, modifiers, and settings. Both `view(time, modifierStop?)` and `view.evaluate(time, modifierStop?)` apply the conversion once after evaluation. Modifiers receive the original curve. Use the read-only `.source` reference to evaluate it directly.

Object operations such as `Object.keys()` and `Object.defineProperty()` act on the view itself. Use `.source` to inspect or define properties on the original curve.

```typescript
import { Curve } from 'curves';

const path = new Curve({
    0: { x: 0, y: 0, z: 0 },
    1: { x: 2, y: 4, z: 6 },
});
const coordinates = path.cast(({ x, y, z }) => [x, y, z] as const);

coordinates(0.5);                 // [1, 2, 3]
coordinates.evaluate(0.5);        // [1, 2, 3]
coordinates.source(0.5);          // { x: 1, y: 2, z: 3 }
```

### Interpolate With Any Type

Curves and keyframes are generic, with 9 built-in type implementations and unlimited potential for more.

```typescript
import { 
    NumberKeyframe,
    StringKeyframe,
    BooleanKeyframe,
    RGBColorKeyframe,
    Vector3Keyframe
} from 'curves';

const numberKeyframe = new NumberKeyframe(0, 4);
const stringKeyframe = new StringKeyframe(1, "Hello world!");
const boolKeyframe = new BooleanKeyframe(2, true);
const colorKeyframe = new RGBColorKeyframe(3, {
    r: 255,
    g: 125,
    b: 0,
});
const vectorKeyframe = new Vector3Keyframe(4, {
    x: 1,
    y: 4,
    z: 0,
});
```

### Add Modifiers to your Curve

Modifiers of any type are easy to create and add to your curve.

```typescript
import { Curve, Modifiers } from 'curves';

// Define the curve using a builder
const curve: Curve<number> = Curve.builder<number>(
    NumberKeyframe,
    0,
    10,
    5,
);

// Add layered noise modifiers
curve.addModifier(new Modifiers.Number.Noise(0.1, 0.5));
curve.addModifier(new Modifiers.Number.Noise(0.025, 2));

// Add a clamp modifier
curve.addModifier(new Modifiers.Number.Clamp(0, 10));
```
